const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /onSaveAsPart\(name, savePartContent, category, section, items\);/,
  "onSaveAsPart(name, savePartContent, category, section, items, isUpdate);"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
