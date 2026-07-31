const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /className="bg-bg-input border border-border-main text-\[10px\] font-mono text-text-main rounded px-2 py-1\.5 outline-none cursor-pointer uppercase font-bold tracking-wider hover:bg-border-main transition-colors shrink-0"/g,
  "className={`border border-border-main text-[10px] font-mono rounded px-2 py-1.5 outline-none cursor-pointer uppercase font-bold tracking-wider transition-colors shrink-0 ${theme === 'mono' ? 'bg-bg-input text-text-main hover:bg-gray-500 hover:text-white' : 'bg-bg-input text-text-main hover:bg-border-main'}`}"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn select");
