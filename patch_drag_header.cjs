const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const regexWholeDiv = /<div \s*key=\{secId\} \s*className="space-y-4"\s*draggable=\{editingId === null && editingCategory === null\}\s*onDragStart=\{\(e\) => handleSectionDragStart\(e, Number\(secId\)\)\}\s*onDragEnd=\{handleSectionDragEnd\}\s*onDragOver=\{\(e\) => handleSectionDragOver\(e, Number\(secId\)\)\}\s*>/m;
code = code.replace(regexWholeDiv, `<div 
                key={secId} 
                className="space-y-4"
                onDragOver={(e) => handleSectionDragOver(e, Number(secId))}
              >`);

const regexHeaderDiv = /<div className=\{((\`[^`]+\`)|("[^"]+"))\}>/m;
// Wait, the header div is:
// <div className={`flex items-center justify-between p-2 border-l-4 shadow-sm bg-transparent group text-text-main ${...}`}>
const headerDivMatch = code.match(/<div className=\{\`flex items-center justify-between p-2 border-l-4 shadow-sm bg-transparent group text-text-main \$\{[\s\S]*?\}\`\}>/);
if (headerDivMatch) {
  code = code.replace(headerDivMatch[0], headerDivMatch[0].replace('<div className=', '<div draggable={editingId === null && editingCategory === null} onDragStart={(e) => handleSectionDragStart(e, Number(secId))} onDragEnd={handleSectionDragEnd} className=').replace('>', ' style={{ cursor: "grab" }}>'));
}

fs.writeFileSync('src/components/VariationColumn.tsx', code);
