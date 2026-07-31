const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onCopyBulkToPart=\{\(masters\) => setSavePartFromMasterData\(\{ items: masters\.map\(m => \(\{ name: m\.name, content: m\.content \}\)\) \}\)\}/g,
  `onCopyBulkToPart={(masters) => setSavePartFromMasterData({ items: masters.map(m => ({ name: m.name, content: m.content })) })}
              onCopyBulkToPartDirect={(masters, category, section) => {
                masters.forEach(m => handleAddPart(category, section, m.name, m.content));
              }}
              uniqueCategories={uniqueCategories}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
