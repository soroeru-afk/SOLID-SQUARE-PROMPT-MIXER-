const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add state
code = code.replace(
  /const \[selectedNegativeId, setSelectedNegativeId\] = useState<string \| null>\(null\);/,
  "const [selectedNegativeId, setSelectedNegativeId] = useState<string | null>(null);\n  const [activePartId, setActivePartId] = useState<string | null>(null);"
);

// Update handleSelectMasterId
code = code.replace(
  /const handleSelectMasterId = \(id: string\) => \{\n\s*setSelectedMasterId\(id\);/,
  "const handleSelectMasterId = (id: string) => {\n    setSelectedMasterId(id);\n    setActivePartId(null);"
);

// Update handleSelectNegativeId
code = code.replace(
  /const handleSelectNegativeId = \(id: string\) => \{\n\s*setSelectedNegativeId\(id\);/,
  "const handleSelectNegativeId = (id: string) => {\n    setSelectedNegativeId(id);\n    setActivePartId(null);"
);

// Update handleTogglePart
code = code.replace(
  /const handleTogglePart = \(id: string\) => \{\n\s*const part = data\.parts\.find\(p => p\.id === id\);/,
  "const handleTogglePart = (id: string) => {\n    setActivePartId(id);\n    const part = data.parts.find(p => p.id === id);"
);

// Update handleTabsClear
code = code.replace(
  /setSelectedNegativeId\(null\);/,
  "setSelectedNegativeId(null);\n    setActivePartId(null);"
);

// Update PreviewColumn props
code = code.replace(
  /selectedPartId=\{selectedPartIds\.size === 1 \? Array\.from<string>\(selectedPartIds\)\[0\] : undefined\}/,
  "selectedPartId={activePartId || undefined}"
);
code = code.replace(
  /selectedPartName=\{selectedPartIds\.size === 1 \? data\.parts\.find\(p => p\.id === Array\.from<string>\(selectedPartIds\)\[0\]\)\?\.name : undefined\}/,
  "selectedPartName={activePartId ? data.parts.find(p => p.id === activePartId)?.name : undefined}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched activePartId");
