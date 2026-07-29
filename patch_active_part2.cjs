const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[selectedNegativeId, setSelectedNegativeId\] = useState<string \| null>\(\(\) => \{[\s\S]*?\}\);/,
  "$&" + "\n  const [activePartId, setActivePartId] = useState<string | null>(null);"
);

code = code.replace(
  /const handleSelectMasterId = \(id: string\) => \{\n\s*setSelectedMasterId\(id\);/,
  "const handleSelectMasterId = (id: string) => {\n    setSelectedMasterId(id);\n    setActivePartId(null);"
);

code = code.replace(
  /const handleSelectNegativeId = \(id: string\) => \{\n\s*setSelectedNegativeId\(id\);/,
  "const handleSelectNegativeId = (id: string) => {\n    setSelectedNegativeId(id);\n    setActivePartId(null);"
);

code = code.replace(
  /const handleTogglePart = \(id: string\) => \{\n\s*const part = data\.parts\.find\(p => p\.id === id\);/,
  "const handleTogglePart = (id: string) => {\n    setActivePartId(id);\n    const part = data.parts.find(p => p.id === id);"
);

code = code.replace(
  /const handleTabsClear = \(\) => \{\n\s*setEditorText\(''\);\n\s*setNegativeEditorText\(''\);\n\s*setSelectedMasterId\(null\);\n\s*setSelectedNegativeId\(null\);/,
  "const handleTabsClear = () => {\n    setEditorText('');\n    setNegativeEditorText('');\n    setSelectedMasterId(null);\n    setSelectedNegativeId(null);\n    setActivePartId(null);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched activePartId 2");
