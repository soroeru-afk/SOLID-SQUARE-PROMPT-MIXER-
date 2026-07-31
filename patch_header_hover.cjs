const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /className=\{`w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main rounded transition-colors flex items-center justify-center shrink-0 \$\{theme === 'mono' \? 'hover:text-white text-text-main' : 'text-text-main'\}`\}/g,
  "className={`w-7 h-7 bg-bg-input border border-border-main rounded transition-colors flex items-center justify-center shrink-0 ${theme === 'mono' ? 'hover:bg-gray-200 text-black' : 'hover:bg-border-main text-text-main'}`}"
);

code = code.replace(
  /className=\{`h-7 bg-bg-input hover:bg-border-main border border-border-main text-\[10px\] font-mono rounded px-2\.5 transition-colors flex items-center justify-center shrink-0 \$\{theme === 'mono' \? 'hover:text-white text-text-main' : 'text-text-main'\}`\}/g,
  "className={`h-7 bg-bg-input border border-border-main text-[10px] font-mono rounded px-2.5 transition-colors flex items-center justify-center shrink-0 ${theme === 'mono' ? 'hover:bg-gray-200 text-black' : 'hover:bg-border-main text-text-main'}`}"
);

code = code.replace(
  /className=\{`h-7 px-2\.5 bg-bg-input hover:bg-border-main text-\[10px\] font-mono border border-border-main rounded transition-colors flex items-center justify-center shrink-0 \$\{theme === 'mono' \? 'hover:text-white text-text-main' : 'text-text-main'\}`\}/g,
  "className={`h-7 px-2.5 bg-bg-input text-[10px] font-mono border border-border-main rounded transition-colors flex items-center justify-center shrink-0 ${theme === 'mono' ? 'hover:bg-gray-200 text-black' : 'hover:bg-border-main text-text-main'}`}"
);

code = code.replace(
  /theme === 'mono' \? 'bg-bg-input hover:bg-border-main border-border-main hover:text-white text-text-main' : 'bg-bg-input hover:bg-border-main border-border-main text-text-main'/g,
  "theme === 'mono' ? 'bg-bg-input hover:bg-gray-200 border-border-main text-black' : 'bg-bg-input hover:bg-border-main border-border-main text-text-main'"
);

code = code.replace(
  /className=\{`w-full text-center px-2 py-1\.5 bg-bg-panel hover:bg-border-main border border-border-main rounded text-\[10px\] font-mono truncate transition-colors \$\{theme === 'mono' \? 'hover:text-white text-text-main' : 'text-text-main'\}`\}/g,
  "className={`w-full text-center px-2 py-1.5 bg-bg-panel border border-border-main rounded text-[10px] font-mono truncate transition-colors ${theme === 'mono' ? 'hover:bg-gray-200 text-black' : 'hover:bg-border-main text-text-main'}`}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx hover");
