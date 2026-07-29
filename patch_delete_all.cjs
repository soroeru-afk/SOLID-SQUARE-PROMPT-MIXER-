const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleDeleteAllParts = \(\) => \{\n\s*setData\(prev => \(\{ \.\.\.prev, parts: \[\] \}\)\);/,
  "const handleDeleteAllParts = () => {\n    setData(prev => ({ ...prev, parts: [] }));\n    setActivePartId(null);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched handleDeleteAllParts");
