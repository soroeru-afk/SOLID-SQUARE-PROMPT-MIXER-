const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

let newCode = code.replace(
  /className=\{\`px-2 py-1 rounded-l transition-colors flex items-center justify-center \$\{viewMode === 'list' \? 'bg-border-hover text-text-main' : 'text-text-dim hover:bg-border-main'\}\`\}/g,
  "className={`px-2 py-1 rounded-l transition-colors flex items-center justify-center ${viewMode === 'list' ? 'bg-text-main text-bg-base' : 'text-text-dim hover:bg-border-main hover:text-text-main'}`}"
);

newCode = newCode.replace(
  /className=\{\`px-2 py-1 rounded-r border-l border-border-main transition-colors flex items-center justify-center \$\{viewMode === 'dropdown' \? 'bg-border-hover text-text-main' : 'text-text-dim hover:bg-border-main'\}\`\}/g,
  "className={`px-2 py-1 rounded-r border-l border-border-main transition-colors flex items-center justify-center ${viewMode === 'dropdown' ? 'bg-text-main text-bg-base' : 'text-text-dim hover:bg-border-main hover:text-text-main'}`}"
);

fs.writeFileSync('src/components/MasterColumn.tsx', newCode);
console.log("Patched MasterColumn view toggle");
