const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// Patch the CANCEL button hover in VariationColumn
code = code.replace(
  /className="px-3 py-1\.5 bg-bg-input hover:bg-border-main text-text-dim rounded text-\[10px\] font-mono transition-colors"/g,
  'className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-text-dim hover:text-text-main rounded text-[10px] font-mono transition-colors"'
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn");
