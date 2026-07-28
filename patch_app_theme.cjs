const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /lang=\{lang\}\s*\/>\s*\)\s*:\s*\(/;
code = code.replace(regex1, "lang={lang}\n              theme={theme}\n            />\n          ) : (");

const regex2 = /lang=\{lang\}\s*\/>\s*\)\}\s*<\/aside>/;
code = code.replace(regex2, "lang={lang}\n              theme={theme}\n            />\n          )}\n          </aside>");

fs.writeFileSync('src/App.tsx', code);
