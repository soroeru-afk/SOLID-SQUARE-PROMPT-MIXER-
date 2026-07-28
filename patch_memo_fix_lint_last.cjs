const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

const regex = /<button \n\s*onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); if \(onCopyToPart\) onCopyToPart\(item\); \}\}\n\s*className="p-1\.5 text-text-dim hover:text-green-400 hover:bg-bg-input transition-colors"\n\s*title="Copy to Variation Parts"\n\s*><ArrowRightToLine className="w-3 h-3" \/><\/button>/g;

code = code.replace(regex, "");

fs.writeFileSync('src/components/MemoColumn.tsx', code);
