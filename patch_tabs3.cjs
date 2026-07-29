const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /\? \(theme === 'light' \? 'bg-white border-blue-400 text-blue-700 font-bold shadow-sm' : 'bg-bg-input border-blue-500\/60 text-blue-400 font-bold shadow-sm'\)/,
  "? (theme === 'light' ? 'bg-gray-700 border-gray-700 text-white font-bold shadow-sm' : 'bg-white border-white text-gray-900 font-bold shadow-sm')"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched tabs correctly");
