const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Patch Select
  code = code.replace(
    /className="flex-1 min-w-\[70px\] bg-bg-input hover:bg-text-main hover:text-bg-base border border-border-hover text-text-main text-\[10px\] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:hover:bg-bg-input disabled:hover:text-text-main"/g,
    'className="flex-1 min-w-[70px] bg-bg-input hover:bg-bg-surface border border-border-main hover:border-text-dim text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer disabled:opacity-50"'
  );
  
  // Patch Cancel button
  code = code.replace(
    /className="px-3 py-1\.5 bg-bg-input hover:bg-text-main hover:text-bg-base border border-transparent hover:border-border-hover text-text-dim rounded text-\[10px\] font-mono transition-colors"/g,
    'className="px-3 py-1.5 bg-transparent hover:bg-bg-input border border-transparent hover:border-border-main text-text-dim hover:text-text-main rounded text-[10px] font-mono transition-colors"'
  );
  
  fs.writeFileSync(file, code);
}

patch('src/components/MasterColumn.tsx');
patch('src/components/VariationColumn.tsx');

console.log("Patched hover colors");
