const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

// The dropdown view has bulk actions and list item actions
code = code.replace(/\{onCopyBulkToPart && \([\s\S]*?<\/button>\n\s*\)\}/g, "");
code = code.replace(/<button \n\s*className="block w-full text-left px-4 py-2 hover:bg-bg-surface text-text-dim hover:text-text-main"\n\s*onClick=\{handleBulkCopyToPart\}\n\s*>\n\s*\{t\('copy_to_variation', lang\)\}\n\s*<\/button>/g, "");
code = code.replace(/<button \n\s*className="block w-full text-left px-4 py-2 hover:bg-bg-surface text-text-dim hover:text-text-main"\n\s*onClick=\{\(\) => \{\n\s*if \(onCopyToPart\) onCopyToPart\(item\);\n\s*\}\}\n\s*>\n\s*\{t\('copy_to_variation', lang\)\}\n\s*<\/button>/g, "");

fs.writeFileSync('src/components/MemoColumn.tsx', code);
