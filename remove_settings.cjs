const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regex = /if \(metadata\.settings && !isNegative\) \{\s*\/\/[^\n]*\n\s*setEditorText\([^\)]*\);\s*\}/;
code = code.replace(regex, '');

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Removed settings block");
