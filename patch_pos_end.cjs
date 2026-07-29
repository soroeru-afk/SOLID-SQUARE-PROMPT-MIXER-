const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regex = /<\/textarea>\s*<\/div>\s*<\/div>\s*\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}/;
if (code.match(regex)) {
  code = code.replace(regex, `</textarea>\n            </div>\n          )}\n        </div>\n\n        {/* Move/Copy Text Buttons & Resizer */}`);
  fs.writeFileSync('src/components/PreviewColumn.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
