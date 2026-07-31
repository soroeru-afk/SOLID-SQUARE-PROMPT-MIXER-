const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Header buttons patch
code = code.replace(
  /className="w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main text-text-main rounded transition-colors flex items-center justify-center shrink-0"/g,
  "className={`w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main rounded transition-colors flex items-center justify-center shrink-0 ${theme === 'mono' ? 'hover:text-white text-text-main' : 'text-text-main'}`}"
);

code = code.replace(
  /className="h-7 bg-bg-input hover:bg-border-main border border-border-main text-\[10px\] font-mono text-text-main rounded px-2\.5 transition-colors flex items-center justify-center shrink-0"/g,
  "className={`h-7 bg-bg-input hover:bg-border-main border border-border-main text-[10px] font-mono rounded px-2.5 transition-colors flex items-center justify-center shrink-0 ${theme === 'mono' ? 'hover:text-white text-text-main' : 'text-text-main'}`}"
);

code = code.replace(
  /className="h-7 px-2\.5 bg-bg-input hover:bg-border-main text-\[10px\] font-mono border border-border-main rounded text-text-main transition-colors flex items-center justify-center shrink-0"/g,
  "className={`h-7 px-2.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-main rounded transition-colors flex items-center justify-center shrink-0 ${theme === 'mono' ? 'hover:text-white text-text-main' : 'text-text-main'}`}"
);

code = code.replace(
  /'bg-bg-input hover:bg-border-main border-border-main text-text-main'/g,
  "theme === 'mono' ? 'bg-bg-input hover:bg-border-main border-border-main hover:text-white text-text-main' : 'bg-bg-input hover:bg-border-main border-border-main text-text-main'"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched header buttons");
