const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const oldClass = 'className="flex-1 py-2.5 transition-all font-mono font-bold text-xs rounded border bg-gray-500 hover:bg-gray-400 active:bg-gray-600 border-transparent text-white active:scale-[0.98] cursor-pointer"';

const newClass = "className={`flex-1 py-2.5 transition-all font-mono font-bold text-xs rounded border active:scale-[0.98] cursor-pointer ${theme === 'mono' ? 'bg-gray-500 hover:bg-gray-400 active:bg-gray-600 border-transparent text-white' : 'bg-bg-surface hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 border-border-hover text-text-main'}`}";

code = code.split(oldClass).join(newClass);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn copy buttons to be conditional");
