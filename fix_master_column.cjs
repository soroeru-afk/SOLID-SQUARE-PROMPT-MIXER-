const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

// Replace the specific line and insert the missing </div>
code = code.replace(
  /            <\/div>\n      <div className="flex-1 overflow-y-scroll p-2 space-y-2 bg-bg-panel relative">/,
  '            </div>\n      </div>\n      <div className="flex-1 overflow-y-scroll p-2 space-y-2 bg-bg-panel relative">'
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Fixed MasterColumn");
