const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Text colors for PROMPT and NEGATIVE PROMPT
code = code.replace(/className=\{`flex items-center gap-1 text-\[10px\] font-mono font-bold uppercase mt-1 transition-colors \$\{paperMode \? 'text-black' : 'text-text-main'\} hover:opacity-70`\}/g, 
  "className={`flex items-center gap-1 text-[10px] font-mono font-bold uppercase mt-1 transition-colors text-black dark:text-white hover:opacity-70`}");

// 2. Tab heights - make them even tighter
// Tab item
code = code.replace(/className=\{`group flex items-center gap-1\.5 px-3 py-1 text-\[10px\] font-mono border rounded-sm/g, 
  "className={`group flex items-center gap-1.5 px-3 py-0.5 text-[10px] font-mono border rounded-sm");

// All Clear button
code = code.replace(/className=\{`ml-auto px-3 py-1 text-\[9px\] font-mono font-bold border rounded-sm/g, 
  "className={`ml-auto px-3 py-0.5 text-[9px] font-mono font-bold border rounded-sm");

// X button on tabs
code = code.replace(/className=\{`ml-1 w-4 h-4 flex items-center/g, 
  "className={`ml-1 w-3.5 h-3.5 flex items-center");
code = code.replace(/<div className="ml-1 w-4 h-4 flex items-center justify-center opacity-0 pointer-events-none shrink-0">/g,
  '<div className="ml-1 w-3.5 h-3.5 flex items-center justify-center opacity-0 pointer-events-none shrink-0">');

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Applied final fixes");
