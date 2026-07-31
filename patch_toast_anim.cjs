const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const animRegex = /initial=\{\{ opacity: 0, y: 50, scale: 0\.9 \}\}\s*animate=\{\{ opacity: 1, y: 0, scale: 1 \}\}\s*exit=\{\{ opacity: 0, y: 20, scale: 0\.9 \}\}/;
const newAnim = `initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}`;

code = code.replace(animRegex, newAnim);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched toast animation");
