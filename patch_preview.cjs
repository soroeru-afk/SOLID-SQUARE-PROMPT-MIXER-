const fs = require('fs');

let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /className=\{\`px-2 h-8 \$\{theme === 'mono'/g,
  'className={`px-2 h-8 whitespace-nowrap shrink-0 ${theme === \\"mono\\"'
);

code = code.replace(
  /className=\{\`px-3 h-8 border rounded text-\[11px\] font-mono transition-colors flex items-center gap-1\.5 shrink-0 \$\{theme === 'mono'/g,
  'className={`px-3 h-8 whitespace-nowrap shrink-0 border rounded text-[11px] font-mono transition-colors flex items-center gap-1.5 shrink-0 ${theme === \\"mono\\"'
);

code = code.replace(
  /className=\{\`px-3 h-8  border rounded text-\[10px\] font-mono transition-colors flex items-center gap-1 shrink-0 \$\{/g,
  'className={`px-3 h-8 whitespace-nowrap shrink-0  border rounded text-[10px] font-mono transition-colors flex items-center gap-1 shrink-0 ${'
);

code = code.replace(
  /className=\{\`h-8 w-8 flex items-center justify-center \$\{theme === 'mono'/g,
  'className={`h-8 w-8 whitespace-nowrap shrink-0 flex items-center justify-center ${theme === \\"mono\\"'
);

code = code.replace(
  /<div className=\"w-px h-6 bg-border-main my-auto mx-1\"><\/div>/g,
  '<div className="w-px h-6 shrink-0 bg-border-main my-auto mx-1"></div>'
);

code = code.replace(
  /className=\"flex justify-between items-start sm:items-center px-3 pt-2 pb-1 gap-2 flex-nowrap border-b border-border-main\/30\"/g,
  'className="flex justify-between items-start sm:items-center px-3 pt-2 pb-1 gap-2 flex-nowrap overflow-x-auto hide-scroll border-b border-border-main/30"'
);

code = code.replace(
  /<div className=\"flex items-center gap-1 sm:gap-2 flex-nowrap\">/g,
  '<div className="flex items-center gap-1 sm:gap-2 flex-nowrap shrink-0">'
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("PreviewColumn patched.");
