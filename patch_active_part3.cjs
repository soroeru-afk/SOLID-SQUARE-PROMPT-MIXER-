const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /setSelectedMasterId\(id\);/g,
  "setSelectedMasterId(id);\n    setActivePartId(null);"
);

code = code.replace(
  /setSelectedNegativeId\(id\);/g,
  "setSelectedNegativeId(id);\n    setActivePartId(null);"
);

code = code.replace(
  /const handleTabsClear = useCallback\(\(\) => \{/,
  "const handleTabsClear = useCallback(() => {\n    setActivePartId(null);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched activePartId 3");
