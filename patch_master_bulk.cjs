const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

// Replace the bulk action bar
const bulkBarRegex = /<div className="sticky top-0 z-20 bg-bg-panel\/90 backdrop-blur pb-2 mb-2 border-b border-border-main flex flex-wrap gap-2 justify-between items-center">[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/;

const newBulkBar = `<div className="sticky top-0 z-20 bg-bg-panel/90 backdrop-blur pb-2 mb-2 border-b border-border-main">
            <div className="flex flex-wrap items-center gap-2 bg-bg-surface p-2 border border-blue-500/30 rounded shadow-sm shrink-0 min-h-[42px]">
              <span className="text-[10px] font-mono text-blue-400 flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500/10 rounded-full font-bold">{bulkSelectedIds.size}</span>
              
              {activeTab === 'master' && (
                <div className="flex gap-1 p-0.5 bg-bg-base border border-border-main rounded shrink-0">
                  {['⭐', '✔', '💡', '📌', '⚠️', '❌'].map(m => (
                    <button 
                      key={m}
                      onClick={() => {
                        bulkSelectedIds.forEach(id => currentOnUpdate(id, { mark: m === '❌' ? undefined : m }));
                        setBulkSelectedIds(new Set());
                      }}
                      className={\`w-5 h-5 rounded flex items-center justify-center text-xs hover:bg-bg-input \${m === '✔' ? 'text-blue-500' : ''}\`}
                      title={m === '❌' ? "Remove Mark" : "Apply Mark"}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}

              {currentOnMoveBulk && (
                <div className="flex gap-1 p-0.5 bg-bg-base border border-border-main rounded shrink-0">
                  <button onClick={() => currentOnMoveBulk(Array.from(bulkSelectedIds), 'top')} className="w-5 h-5 rounded flex items-center justify-center hover:bg-bg-input text-text-dim hover:text-text-main" title="Move to Top">
                    <ChevronsUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => currentOnMoveBulk(Array.from(bulkSelectedIds), 'up')} className="w-5 h-5 rounded flex items-center justify-center hover:bg-bg-input text-text-dim hover:text-text-main" title="Move Up">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => currentOnMoveBulk(Array.from(bulkSelectedIds), 'down')} className="w-5 h-5 rounded flex items-center justify-center hover:bg-bg-input text-text-dim hover:text-text-main" title="Move Down">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => currentOnMoveBulk(Array.from(bulkSelectedIds), 'bottom')} className="w-5 h-5 rounded flex items-center justify-center hover:bg-bg-input text-text-dim hover:text-text-main" title="Move to Bottom">
                    <ChevronsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {onCopyBulkToPart && (
                <select 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    const itemsToCopy = currentList.filter(item => bulkSelectedIds.has(item.id));
                    
                    if (val === 'default') {
                      onCopyBulkToPart(itemsToCopy);
                    } else {
                      const [sectionStr, ...catParts] = val.split(':');
                      const category = catParts.join(':');
                      const section = Number(sectionStr);
                      if (onCopyBulkToPartDirect) {
                        onCopyBulkToPartDirect(itemsToCopy, category, section);
                      }
                    }
                    setBulkSelectedIds(new Set());
                    e.target.value = '';
                  }}
                  value=""
                  className="flex-1 min-w-[70px] bg-bg-input hover:bg-border-main border border-border-hover text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Copy to Parts...</option>
                  <option value="default">{t('save_as_part', lang)}...</option>
                  {uniqueCategories && uniqueCategories.length > 0 && <option disabled>──────────</option>}
                  {uniqueCategories?.map(([cat, sec]) => (
                    <option key={\`\${sec}:\${cat}\`} value={\`\${sec}:\${cat}\`}>
                      {t(cat as any, lang) || cat} ({t(\`sec_\${sec === 1 ? 'composition' : sec === 2 ? 'pose' : sec === 3 ? 'details' : 'context'}\` as any, lang)})
                    </option>
                  ))}
                </select>
              )}
              
              <button onClick={() => setConfirmDeleteBulk(true)} className="flex items-center gap-1 px-2 py-1 bg-transparent hover:bg-red-500/10 border border-red-500/50 rounded text-[10px] font-mono text-red-500 transition-colors whitespace-nowrap">
                <Trash2 className="w-3 h-3" /> DELETE
              </button>
              
              <button onClick={() => setBulkSelectedIds(new Set())} className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[10px] font-mono text-text-dim hover:text-text-main transition-colors whitespace-nowrap">
                {t('clear_selection', lang)}
              </button>
            </div>
          </div>`;

code = code.replace(bulkBarRegex, newBulkBar);

// Patch the CANCEL button hover in MasterColumn
code = code.replace(
  /className="px-3 py-1\.5 bg-bg-input hover:bg-border-main text-text-dim rounded text-\[10px\] font-mono transition-colors"/g,
  'className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-text-dim hover:text-text-main rounded text-[10px] font-mono transition-colors"'
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn");
