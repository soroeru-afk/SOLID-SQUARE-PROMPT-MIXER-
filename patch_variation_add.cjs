const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /onAdd: \(category: string, section: number, name: string\) => void;/,
  "onAdd: (category: string, section: number, name: string, content?: string) => void;"
);

code = code.replace(
  /onConfirm=\{\(name\) => \{\n          if \(confirmAddData\) onAdd\(confirmAddData\.category, confirmAddData\.section, name\);\n          setConfirmAddData\(null\);\n        \}\}/,
  "onConfirm={(name, content) => {\n          if (confirmAddData) onAdd(confirmAddData.category, confirmAddData.section, name, content);\n          setConfirmAddData(null);\n        }}\n        showContentField={true}"
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn");
