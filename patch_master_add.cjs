const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

code = code.replace(
  /onAdd: \(name: string\) => void;/,
  "onAdd: (name: string, content?: string) => void;"
);
code = code.replace(
  /onAddNegative: \(name: string\) => void;/,
  "onAddNegative: (name: string, content?: string) => void;"
);

code = code.replace(
  /onConfirm=\{\(name\) => \{\n          currentOnAdd\(name\);\n          setConfirmAdd\(false\);\n        \}\}/,
  "onConfirm={(name, content) => {\n          currentOnAdd(name, content);\n          setConfirmAdd(false);\n        }}\n        showContentField={true}"
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn");
