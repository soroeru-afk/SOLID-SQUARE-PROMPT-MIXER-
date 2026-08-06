const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const moveCatRegex = /const moveCategory =/g;
if (!content.match(moveCatRegex)) {
  const insertIndex = content.indexOf("const deleteCheckedItems = () => {");
  const functions = `
  const moveCategory = (catId: string, direction: 'top' | 'bottom') => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === catId);
      if (idx === -1) return prev;
      const newCats = [...prev];
      const [item] = newCats.splice(idx, 1);
      
      const firstNegIdx = newCats.findIndex(c => c.isNegative);
      const isNeg = item.isNegative;
      
      if (direction === 'top') {
        if (isNeg) {
           newCats.splice(firstNegIdx === -1 ? newCats.length : firstNegIdx, 0, item);
        } else {
           newCats.unshift(item);
        }
      } else {
        if (isNeg) {
           newCats.push(item);
        } else {
           if (firstNegIdx === -1) newCats.push(item);
           else newCats.splice(firstNegIdx, 0, item);
        }
      }
      return newCats;
    });
  };

  const moveCheckedItemsToCategory = (targetCatId: string) => {
    if (checkedItems.size === 0) return;
    
    setPresets(prev => {
      const newState = { ...prev };
      const itemsToMove: {catId: string, idx: number}[] = [];
      
      checkedItems.forEach(id => {
        const [catId, idxStr] = id.split(':');
        const idx = parseInt(idxStr, 10);
        if (catId && !isNaN(idx) && catId !== targetCatId) {
          itemsToMove.push({ catId, idx });
        }
      });
      
      if (itemsToMove.length === 0) return prev;

      const targetList = [...(newState[targetCatId] || DEFAULT_PRESETS[targetCatId] || [{ label: '指定なし / None', value: '' }])];
      
      const catIds = Array.from(new Set(itemsToMove.map(i => i.catId)));
      catIds.forEach(catId => {
        const indicesToRemove = itemsToMove.filter(i => i.catId === catId).map(i => i.idx).sort((a, b) => b - a);
        const newList = [...(newState[catId] || DEFAULT_PRESETS[catId] || [{ label: '指定なし / None', value: '' }])];
        indicesToRemove.forEach(idx => {
          const [item] = newList.splice(idx, 1);
          targetList.push(item);
        });
        newState[catId] = newList;
      });
      
      newState[targetCatId] = targetList;
      return newState;
    });
    
    // Uncheck and reset selections if they were pointing to moved items
    setCheckedItems(new Set());
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
`;
  content = content.substring(0, insertIndex) + functions + content.substring(insertIndex);
  fs.writeFileSync('src/components/AttributeMixer.tsx', content);
  console.log('Added missing functions');
} else {
  console.log('Functions already exist');
}
