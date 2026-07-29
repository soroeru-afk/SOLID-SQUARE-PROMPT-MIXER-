const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(/ spellCheck=\{false\}\n\s*\/>\n\s*<\/div>\n\s*<\/div>/, ` spellCheck={false}\n            />\n          </div>\n          )}\n        </div>`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
