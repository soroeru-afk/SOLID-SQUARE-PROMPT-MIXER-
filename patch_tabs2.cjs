const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /className=\{`group flex items-center gap-1\.5 px-3 py-1 text-\[10px\] font-mono border rounded cursor-pointer whitespace-nowrap transition-all \$\{\\n\s*activeTabId === tab\.id \\n\s*\? \(theme === 'light' \? 'bg-white border-blue-400 text-blue-700 font-bold shadow-sm' : 'bg-bg-input border-blue-500\/60 text-blue-400 font-bold shadow-sm'\) \\n\s*: 'bg-bg-base border-border-main text-text-dim hover:bg-bg-input hover:text-text-main hover:border-border-hover'\\n\s*\}\`\}/,
  `className={\`group flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono border rounded cursor-pointer whitespace-nowrap transition-all \${
                activeTabId === tab.id 
                  ? (theme === 'light' ? 'bg-white border-blue-400 text-blue-700 font-bold shadow-sm' : 'bg-bg-input border-blue-500/60 text-blue-400 font-bold shadow-sm') 
                  : 'bg-bg-base border-border-main text-text-dim hover:bg-bg-input hover:text-text-main hover:border-border-hover'
              }\`}`
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched tabs correctly");
