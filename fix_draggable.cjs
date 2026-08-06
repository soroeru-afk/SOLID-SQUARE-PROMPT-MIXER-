const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

content = content.replace(
  'draggable={!isRenaming && !isEditing && dragEnabledCatId === key}',
  'draggable={!isRenaming && !isEditing && (dragEnabledCatId === key || draggedCatId === key)}'
);

content = content.replace(
  'draggable={idx !== 0 && dragEnabledItemId?.category === key && dragEnabledItemId?.index === idx}',
  'draggable={idx !== 0 && ((dragEnabledItemId?.category === key && dragEnabledItemId?.index === idx) || (draggedItemId?.category === key && draggedItemId?.index === idx))}'
);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('draggable patched');
