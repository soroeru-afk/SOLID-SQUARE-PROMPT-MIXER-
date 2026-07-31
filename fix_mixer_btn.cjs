const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

code = code.replace(
  /className="flex items-center gap-1 px-3 py-1\.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-\[10px\] font-mono font-bold transition-colors shadow-sm"/,
  'className="flex items-center justify-center w-full gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-mono font-bold transition-colors shadow-sm"'
);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
console.log("Updated AttributeMixer button styling");
