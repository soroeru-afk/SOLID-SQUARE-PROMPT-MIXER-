const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Add state
code = code.replace("const [negativeHeight, setNegativeHeight] = useState(120);", "const [negativeHeight, setNegativeHeight] = useState(120);\n  const [isNegativeOpen, setIsNegativeOpen] = useState(true);");

// Update resizer block - hide it if !isNegativeOpen
const resizerRegex = /\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}\n\s*<div className="flex justify-center -my-3 relative z-10">\n\s*<div \n\s*className="absolute inset-x-0 top-1\/2 -translate-y-1\/2 h-6 cursor-row-resize flex items-center justify-center group" \n\s*onMouseDown=\{handleResizeStart\}\n\s*title="Drag to resize"\n\s*>\n\s*<div className=\{`w-full h-px \$\{isResizing \? 'bg-accent-main' : 'bg-transparent group-hover:bg-border-main'\} transition-colors`\} \/>\n\s*<\/div>\n\s*<div className="flex gap-2 bg-bg-panel p-1 rounded-full border border-border-main shadow-sm relative z-20">\n\s*<button \n\s*onClick=\{\(\) => handleCopyTextBetweenEditors\('down'\)\}\n\s*className="px-2 py-1 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center gap-1 text-\[9px\] font-mono"\n\s*title=\{t\('copy_to_negative', lang\)\}\n\s*>\n\s*<Copy size=\{12\} \/> <ArrowDown size=\{12\} \/>\n\s*<\/button>\n\s*<button \n\s*onClick=\{\(\) => handleMoveTextBetweenEditors\('down'\)\}\n\s*className="p-1\.5 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center"\n\s*title=\{t\('move_to_negative', lang\)\}\n\s*>\n\s*<ArrowDown size=\{14\} \/>\n\s*<\/button>\n\s*<div className="w-px h-6 bg-border-main my-auto mx-1"><\/div>\n\s*<button \n\s*onClick=\{\(\) => handleMoveTextBetweenEditors\('up'\)\}\n\s*className="p-1\.5 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center"\n\s*title=\{t\('move_to_positive', lang\)\}\n\s*>\n\s*<ArrowUp size=\{14\} \/>\n\s*<\/button>\n\s*<button \n\s*onClick=\{\(\) => handleCopyTextBetweenEditors\('up'\)\}\n\s*className="px-2 py-1 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center gap-1 text-\[9px\] font-mono"\n\s*title=\{t\('copy_to_positive', lang\)\}\n\s*>\n\s*<Copy size=\{12\} \/> <ArrowUp size=\{12\} \/>\n\s*<\/button>\n\s*<\/div>\n\s*<\/div>/;

if (!code.match(resizerRegex)) {
  console.log("Resizer not found!");
} else {
  code = code.replace(resizerRegex, `$&`.replace('{/* Move/Copy Text Buttons & Resizer */}', '{/* Move/Copy Text Buttons & Resizer */}\n        {isNegativeOpen && (').replace(/<\/div>$/, '</div>\n        )}'));
}

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Phase 1 done");
