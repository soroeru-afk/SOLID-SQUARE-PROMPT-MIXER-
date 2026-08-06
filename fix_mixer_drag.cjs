const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// I will replace the corrupted part with the correct deleteCheckedItems and the missing functions.
const startStr = "const deleteCheckedItems = () => {";
const endStr = "  const handleDragStart = (e: React.DragEvent, id: string) => {";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `const deleteCheckedItems = () => {
    if (checkedItems.size === 0) return;
    
    setPresets(prev => {
      const newState = { ...prev };
      const itemsToDelete: {catId: string, idx: number}[] = [];
      
      checkedItems.forEach(id => {
        const [catId, idxStr] = id.split(':');
        const idx = parseInt(idxStr, 10);
        if (catId && !isNaN(idx)) {
          itemsToDelete.push({ catId, idx });
        }
      });
      
      const catIds = Array.from(new Set(itemsToDelete.map(i => i.catId)));
      catIds.forEach(catId => {
        const indicesToRemove = itemsToDelete.filter(i => i.catId === catId).map(i => i.idx).sort((a, b) => b - a);
        const newList = [...(newState[catId] || DEFAULT_PRESETS[catId] || [{ label: '指定なし / None', value: '' }])];
        indicesToRemove.forEach(idx => {
          newList.splice(idx, 1);
        });
        newState[catId] = newList;
      });
      
      return newState;
    });

    setCheckedItems(new Set());
    
    // Also we need to fix selections if the selected item was deleted, but for simplicity let's just reset them to 0 if they are out of bounds, 
    // actually, let's just let them be, the UI will fall back to 0 if out of bounds or we can fix it.
    // I will just reset to 0 for deleted categories to avoid complexity right now.
    setSelections(prev => {
      const newSel = { ...prev };
      checkedItems.forEach(id => {
         const [catId, idxStr] = id.split(':');
         if (newSel[catId] === parseInt(idxStr, 10)) {
           newSel[catId] = 0;
         }
      });
      return newSel;
    });
  };

  const handleItemDragStart = (e: React.DragEvent, category: string, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItemId({ category, index });
    e.dataTransfer.setData('text/plain', \`item:\${category}:\${index}\`);
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleItemDrop = (e: React.DragEvent, targetCategory: string, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemId || draggedItemId.category !== targetCategory) {
      setDraggedItemId(null);
      return;
    }
    const draggedIdx = draggedItemId.index;
    if (draggedIdx === targetIndex || draggedIdx === 0 || targetIndex === 0) {
      setDraggedItemId(null);
      return;
    }

    setPresets(prev => {
      const newCategory = [...(prev[targetCategory] || DEFAULT_PRESETS[targetCategory] || [{ label: '指定なし / None', value: '' }])];
      const [item] = newCategory.splice(draggedIdx, 1);
      newCategory.splice(targetIndex, 0, item);
      return { ...prev, [targetCategory]: newCategory };
    });

    setSelections(prev => {
      const currentSel = prev[targetCategory] || 0;
      let newSel = currentSel;
      
      if (currentSel === draggedIdx) {
        newSel = targetIndex;
      } else if (currentSel > draggedIdx && currentSel <= targetIndex) {
        newSel = currentSel - 1;
      } else if (currentSel < draggedIdx && currentSel >= targetIndex) {
        newSel = currentSel + 1;
      }
      return { ...prev, [targetCategory]: newSel };
    });

    setCheckedItems(prev => {
      const newSet = new Set(prev);
      const isDraggedChecked = prev.has(\`\${targetCategory}:\${draggedIdx}\`);
      
      if (draggedIdx < targetIndex) {
        for (let i = draggedIdx; i < targetIndex; i++) {
          if (prev.has(\`\${targetCategory}:\${i + 1}\`)) newSet.add(\`\${targetCategory}:\${i}\`);
          else newSet.delete(\`\${targetCategory}:\${i}\`);
        }
      } else {
        for (let i = draggedIdx; i > targetIndex; i--) {
          if (prev.has(\`\${targetCategory}:\${i - 1}\`)) newSet.add(\`\${targetCategory}:\${i}\`);
          else newSet.delete(\`\${targetCategory}:\${i}\`);
        }
      }
      
      if (isDraggedChecked) newSet.add(\`\${targetCategory}:\${targetIndex}\`);
      else newSet.delete(\`\${targetCategory}:\${targetIndex}\`);
      
      return newSet;
    });

    setDraggedItemId(null);
  };

`;

  const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('src/components/AttributeMixer.tsx', newContent);
  console.log('Fixed drag and drop');
} else {
  console.log('Could not find bounds');
}
