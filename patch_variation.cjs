const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// 1. mixer container
code = code.replace(
  /<div className="p-4 flex-1 overflow-y-auto">/g,
  '<div className="p-4 flex-1 overflow-y-scroll">'
);

// 2. parts list container
code = code.replace(
  /<div className="flex-1 overflow-y-auto pr-2 space-y-4 content-start min-h-0 pb-12">/g,
  '<div className="flex-1 overflow-y-scroll pr-2 space-y-4 content-start min-h-0 pb-12">'
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
