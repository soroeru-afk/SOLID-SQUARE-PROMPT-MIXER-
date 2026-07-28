const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const typo = /<div draggable=\{editingId === null && editingCategory === null\} onDragStart=\{\(e\) = style=\{\{ cursor: "grab" \}\}> handleSectionDragStart\(e, Number\(secId\)\)\} onDragEnd=\{handleSectionDragEnd\} className=\{`flex/;
code = code.replace(typo, `<div draggable={editingId === null && editingCategory === null} onDragStart={(e) => handleSectionDragStart(e, Number(secId))} onDragEnd={handleSectionDragEnd} style={{ cursor: "grab" }} className={\`flex`);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
