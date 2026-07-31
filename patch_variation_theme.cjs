const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /theme === 'light' \|\| theme === 'paper'/g,
  "(theme === 'light' || theme === 'mono') || theme === 'paper'"
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn theme");
