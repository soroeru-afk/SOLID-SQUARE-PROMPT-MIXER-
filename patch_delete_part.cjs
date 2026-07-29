const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleDeletePart = \(id: string\) => \{\n\s*setData\(prev => \(\{ \.\.\.prev, parts: prev\.parts\.filter\(p => p\.id !== id\) \}\)\);\n\s*if \(selectedPartIds\.has\(id\)\) handleTogglePart\(id\);/,
  "const handleDeletePart = (id: string) => {\n    setData(prev => ({ ...prev, parts: prev.parts.filter(p => p.id !== id) }));\n    if (activePartId === id) setActivePartId(null);\n    if (selectedPartIds.has(id)) handleTogglePart(id);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched handleDeletePart");
