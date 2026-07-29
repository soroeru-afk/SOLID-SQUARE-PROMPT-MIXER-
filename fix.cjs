const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regex = /<\/textarea>\s*<\/div>\s*<\/div>\s*\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}/;
code = code.replace(regex, `</textarea>\n            </div>\n          )}\n        </div>\n\n        {/* Move/Copy Text Buttons & Resizer */}`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
