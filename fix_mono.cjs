const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');
code = code.replace(/\\"mono\\"/g, "'mono'");
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Fixed mono quotes.");
