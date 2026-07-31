const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /\{part\.content\}/,
  "{part.content || <span className=\"text-text-dim/30\">----- (No Content) -----</span>}"
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn empty content");
