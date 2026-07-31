const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

code = code.replace(
  /\{item\.content\}/,
  "{item.content || <span className=\"text-text-dim/30\">----- (No Content) -----</span>}"
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn empty content");
