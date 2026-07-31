const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<MasterColumn\s+masters=\{data\.masters\}/g,
  "<MasterColumn\n              theme={theme}\n              masters={data.masters}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App to pass theme");
