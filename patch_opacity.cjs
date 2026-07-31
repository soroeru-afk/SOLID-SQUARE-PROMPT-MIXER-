const fs = require('fs');
let master = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');
master = master.replace(/className="text-text-dim\/30"/g, 'className="opacity-40"');
fs.writeFileSync('src/components/MasterColumn.tsx', master);

let variation = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');
variation = variation.replace(/className="text-text-dim\/30"/g, 'className="opacity-40"');
fs.writeFileSync('src/components/VariationColumn.tsx', variation);
