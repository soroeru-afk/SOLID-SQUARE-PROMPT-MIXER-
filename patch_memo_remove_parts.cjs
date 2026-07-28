const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

// Remove onCopyToPart and onCopyBulkToPart from props
code = code.replace(/onCopyToPart\?: \(item: MasterPrompt\) => void;\n\s*onCopyBulkToPart\?: \(items: MasterPrompt\[\]\) => void;\n/, "");
code = code.replace(/onReorder, onCopyToPart, onCopyBulkToPart, lang/, "onReorder, lang");

// Remove the buttons
const partButtonRegex = /<button \n\s*onClick=\{\(e\) => \{\n\s*e\.stopPropagation\(\);\n\s*if \(onCopyToPart\) onCopyToPart\(item\);\n\s*\}\}\n\s*className="p-1 hover:bg-bg-input rounded text-text-dim hover:text-text-main transition-colors"\n\s*title=\{t\('copy_to_variation', lang\)\}\n\s*>\n\s*<ArrowRightToLine size=\{12\} \/>\n\s*<\/button>/g;
code = code.replace(partButtonRegex, "");

const partBulkButtonRegex = /\{onCopyBulkToPart && \(\n\s*<button \n\s*onClick=\{handleBulkCopyToPart\}\n\s*className="flex items-center gap-1 px-3 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-\[10px\] font-mono text-text-dim transition-colors"\n\s*>\n\s*<ArrowRightToLine size=\{12\} \/> \{t\('copy_to_variation', lang\)\}\n\s*<\/button>\n\s*\)\}/;
code = code.replace(partBulkButtonRegex, "");

// Remove handleBulkCopyToPart function
const handleBulkCopyToPartRegex = /const handleBulkCopyToPart = \(\) => \{[\s\S]*?setBulkSelectedIds\(new Set\(\)\);\n\s*\}\n\s*\};/;
code = code.replace(handleBulkCopyToPartRegex, "");

fs.writeFileSync('src/components/MemoColumn.tsx', code);
