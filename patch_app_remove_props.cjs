const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\s*onCopyToPart=\{\(item\) => setSavePartFromMasterData\(\{ name: item\.name, content: item\.content \}\)\}/g, "");
code = code.replace(/\s*onCopyBulkToPart=\{\(items\) => setSavePartFromMasterData\(\{ items: items\.map\(i => \(\{name: i\.name, content: i\.content\}\)\) \}\)\}/g, "");

fs.writeFileSync('src/App.tsx', code);
