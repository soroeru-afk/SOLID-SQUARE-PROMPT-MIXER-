const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /hover:bg-gray-200 text-black/g,
  "hover:bg-gray-500 hover:text-white text-text-main"
);

code = code.replace(
  /hover:bg-gray-200 border-border-main text-black/g,
  "hover:bg-gray-500 hover:text-white border-border-main text-text-main"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched hover mono");
