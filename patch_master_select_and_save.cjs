const fs = require('fs');
let master = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

// Patch dropdown select
master = master.replace(
  /className="bg-transparent border border-green-500\/50 text-green-500 hover:bg-green-500\/10 text-\[10px\] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer"/g,
  'className="bg-transparent hover:bg-bg-input border border-border-hover text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer"'
);

// Patch MasterColumn save buttons
master = master.replace(
  /<button onClick=\{\(\) => setEditingId\(null\)\} className="text-text-dim hover:text-text-dim p-1">\s*<X className="w-3 h-3" \/>\s*<\/button>\s*<button onClick=\{\(\) => handleSave\(item\.id\)\} className="text-green-500 hover:text-green-400 p-1">\s*<Check className="w-3 h-3" \/>\s*<\/button>/g,
  `<button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-text-dim rounded text-[10px] font-mono transition-colors">
                      CANCEL
                    </button>
                    <button onClick={() => handleSave(item.id)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-mono font-bold transition-colors">
                      {t('save', lang)}
                    </button>`
);

fs.writeFileSync('src/components/MasterColumn.tsx', master);

let variation = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// Patch VariationColumn save buttons
variation = variation.replace(
  /<button onClick=\{\(\) => setEditingId\(null\)\} className="text-text-dim hover:text-text-dim p-1">\s*<X className="w-3 h-3" \/>\s*<\/button>\s*<button onClick=\{\(\) => handleSave\(part\.id\)\} className="text-green-500 hover:text-green-400 p-1">\s*<Check className="w-3 h-3" \/>\s*<\/button>/g,
  `<button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-text-dim rounded text-[10px] font-mono transition-colors">
                                        CANCEL
                                      </button>
                                      <button onClick={() => handleSave(part.id)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-mono font-bold transition-colors">
                                        {t('save', lang)}
                                      </button>`
);

fs.writeFileSync('src/components/VariationColumn.tsx', variation);
console.log("Patched MasterColumn and VariationColumn");
