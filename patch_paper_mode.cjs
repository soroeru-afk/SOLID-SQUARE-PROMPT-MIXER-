const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /className=\{`h-7 text-\[10px\] font-mono border rounded px-2\.5 transition-colors flex items-center justify-center shrink-0 \$\{paperMode \? 'bg-blue-500\/20 border-blue-500 text-blue-400 font-bold' : theme === 'mono' \? 'bg-bg-input hover:bg-gray-500 hover:text-white border-border-main text-text-main' : 'bg-bg-input hover:bg-border-main border-border-main text-text-main'\}`\}/g,
  "className={`h-7 w-[120px] text-[10px] font-mono border rounded transition-colors flex items-center justify-center shrink-0 ${paperMode ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold' : theme === 'mono' ? 'bg-bg-input hover:bg-gray-500 hover:text-white border-border-main text-text-main' : 'bg-bg-input hover:bg-border-main border-border-main text-text-main'}`}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx paper mode width");
