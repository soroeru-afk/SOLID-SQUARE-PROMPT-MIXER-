const fs = require('fs');

let master = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

// Patch cancel buttons in MasterColumn
master = master.replace(
  /className="px-3 py-1\.5 bg-bg-input hover:bg-border-main text-text-dim hover:text-text-main rounded text-\[10px\] font-mono transition-colors"/g,
  'className="px-3 py-1.5 bg-bg-input hover:bg-gray-500 hover:text-white text-text-dim rounded text-[10px] font-mono transition-colors"'
);

// Patch the select dropdown in MasterColumn
master = master.replace(
  /className="flex-1 min-w-\[70px\] bg-bg-input hover:bg-border-main border border-border-hover text-text-main text-\[10px\] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer"/g,
  'className="flex-1 min-w-[70px] bg-bg-input hover:bg-gray-500 hover:text-white border border-border-hover text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer"'
);

// Patch the select options in MasterColumn to ensure they have proper background and text color
master = master.replace(
  /<option value="" disabled>Copy to Parts...<\/option>/g,
  '<option value="" disabled className="bg-bg-panel text-text-dim">Copy to Parts...</option>'
);
master = master.replace(
  /<option value="default">\{t\('save_as_part', lang\)\}\.\.\.<\/option>/g,
  '<option value="default" className="bg-bg-panel text-text-main">{t(\'save_as_part\', lang)}...</option>'
);
master = master.replace(
  /<option disabled>──────────<\/option>/g,
  '<option disabled className="bg-bg-panel text-text-dim">──────────</option>'
);
master = master.replace(
  /<option key=\{\`\$\{sec\}:\$\{cat\}\`\} value=\{\`\$\{sec\}:\$\{cat\}\`\}>/g,
  '<option key={`${sec}:${cat}`} value={`${sec}:${cat}`} className="bg-bg-panel text-text-main">'
);

fs.writeFileSync('src/components/MasterColumn.tsx', master);

let variation = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// Patch cancel buttons in VariationColumn
variation = variation.replace(
  /className="px-3 py-1\.5 bg-bg-input hover:bg-border-main text-text-dim hover:text-text-main rounded text-\[10px\] font-mono transition-colors"/g,
  'className="px-3 py-1.5 bg-bg-input hover:bg-gray-500 hover:text-white text-text-dim rounded text-[10px] font-mono transition-colors"'
);

fs.writeFileSync('src/components/VariationColumn.tsx', variation);

console.log("Patched colors");
