const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const regex = /setSelections\(prev => \{[\s\S]*?return \{ \.\.\.prev, \[targetCategory\]: newSel \};\n\s*\}\);/;

const replacement = `setSelections(prev => {
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
    });`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/AttributeMixer.tsx', content);
  console.log('checkedItems patched');
} else {
  console.log('checkedItems regex not found');
}
