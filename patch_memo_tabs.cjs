const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

const regexTabs = /<div className="flex bg-bg-panel border-b border-border-main text-\[10px\] font-mono uppercase tracking-widest shrink-0 overflow-x-auto">[\s\S]*?<\/div>/;
code = code.replace(regexTabs, '');

// Also remove the "activeTab === 'master' &&" around the Mark dropdown
code = code.replace(/\{activeTab === 'master' && \(/g, '{true && (');

// Remove isNegative
code = code.replace(/const isNegative = activeTab === 'negative';/g, 'const isNegative = false;');

fs.writeFileSync('src/components/MemoColumn.tsx', code);
