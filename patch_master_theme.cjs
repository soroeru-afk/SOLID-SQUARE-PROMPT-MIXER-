const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

code = code.replace(
  /activeTab: 'master' \| 'negative';/,
  "activeTab: 'master' | 'negative';\n  theme?: string;"
);

code = code.replace(
  /activeTab, setActiveTab, lang/g,
  "activeTab, setActiveTab, lang, theme"
);

code = code.replace(
  /className=\{\`px-2 py-1 rounded-l transition-colors flex items-center justify-center \$\{viewMode === 'list' \? 'bg-text-main text-bg-base' : 'text-text-dim hover:bg-border-main hover:text-text-main'\}\`\}/g,
  "className={`px-2 py-1 rounded-l transition-colors flex items-center justify-center ${viewMode === 'list' ? (theme === 'mono' ? 'bg-black text-white' : 'bg-border-hover text-text-main') : (theme === 'mono' ? 'text-text-dim hover:bg-gray-200 hover:text-black' : 'text-text-dim hover:bg-border-main')}`}"
);

code = code.replace(
  /className=\{\`px-2 py-1 rounded-r border-l border-border-main transition-colors flex items-center justify-center \$\{viewMode === 'dropdown' \? 'bg-text-main text-bg-base' : 'text-text-dim hover:bg-border-main hover:text-text-main'\}\`\}/g,
  "className={`px-2 py-1 rounded-r border-l border-border-main transition-colors flex items-center justify-center ${viewMode === 'dropdown' ? (theme === 'mono' ? 'bg-black text-white' : 'bg-border-hover text-text-main') : (theme === 'mono' ? 'text-text-dim hover:bg-gray-200 hover:text-black' : 'text-text-dim hover:bg-border-main')}`}"
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn with theme");
