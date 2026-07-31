const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => setTheme\(t => t === 'dark' \? 'black' : t === 'black' \? 'light' : t === 'light' \? 'navy' : t === 'navy' \? 'mono' : t === 'mono' \? 'dark' : 'light'\)\}/g,
  "onClick={() => setTheme(t => t === 'dark' ? 'black' : t === 'black' ? 'light' : t === 'light' ? 'mono' : t === 'mono' ? 'navy' : t === 'navy' ? 'dark' : 'light')}"
);

code = code.replace(
  /className=\{`h-7 bg-bg-input border border-border-main text-\[10px\] font-mono rounded px-2\.5 transition-colors flex items-center justify-center shrink-0 \$\{theme === 'mono' \? 'hover:bg-gray-500 hover:text-white text-text-main' : 'hover:bg-border-main text-text-main'\}`\}/g,
  "className={`h-7 w-[130px] bg-bg-input border border-border-main text-[10px] font-mono rounded transition-colors flex items-center justify-center shrink-0 ${theme === 'mono' ? 'hover:bg-gray-500 hover:text-white text-text-main' : 'hover:bg-border-main text-text-main'}`}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx theme button");
