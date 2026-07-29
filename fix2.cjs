const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(/<\/textarea>\n\s*<\/div>\n\s*<\/div>\n\s*\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}/, '</textarea>\n            </div>\n          )}\n        </div>\n\n        {/* Move/Copy Text Buttons & Resizer */}');

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
