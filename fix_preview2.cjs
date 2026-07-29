const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(/<\/div>\s*<\/div>\s*\)\}\s*<div\s*className=\{`border border/g, '</div>\n        </div>\n\n        <div \n          className={`border border');
code = code.replace(/<\/textarea>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Toast Notification \*\/\}/, '</textarea>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      {/* Toast Notification */}');
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Cleanup 2 done");
