const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Patch JSON import button
code = code.replace(
  /className="flex-1 flex items-center justify-center px-2 py-1\.5 bg-border-main hover:bg-border-hover text-\[10px\] font-mono border border-border-hover rounded transition-colors cursor-pointer text-text-main"/g,
  "className={`flex-1 flex items-center justify-center px-2 py-1.5 bg-border-main hover:bg-border-hover text-[10px] font-mono border border-border-hover rounded transition-colors cursor-pointer ${theme === 'mono' ? 'text-white' : 'text-text-main'}`}"
);

// Patch load backup directory button as well (it has bg-bg-panel hover:bg-border-main text-text-main)
code = code.replace(
  /className="w-full text-center px-2 py-1\.5 bg-bg-panel hover:bg-border-main border border-border-main rounded text-\[10px\] font-mono text-text-main truncate transition-colors"/g,
  "className={`w-full text-center px-2 py-1.5 bg-bg-panel hover:bg-border-main border border-border-main rounded text-[10px] font-mono truncate transition-colors ${theme === 'mono' ? 'hover:text-white text-text-main' : 'text-text-main'}`}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched buttons");
