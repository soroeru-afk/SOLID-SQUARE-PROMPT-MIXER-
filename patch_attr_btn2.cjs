const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const catBtnRegex = /<button \n\s*onClick=\{\(e\) => \{\n\s*e\.stopPropagation\(\);\n\s*e\.preventDefault\(\);\n\s*if \(confirm\('この項目を削除しますか？'\)\) \{\n\s*setCategories\(prev => prev\.filter\(c => c\.id !== key\)\);\n\s*setPresets\(prev => \{ const n = \{\.\.\.prev\}; delete n\[key\]; return n; \}\);\n\s*\}\n\s*\}\}\n\s*className="p-0\.5 text-red-500 hover:text-red-400 ml-1" title="削除"\n\s*>\n\s*<Trash2 className="w-3 h-3" \/>\n\s*<\/button>/m;

const newCatBtn = `<button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (confirmDeleteCatId === key) {
                    setCategories(prev => prev.filter(c => c.id !== key));
                    setPresets(prev => { const n = {...prev}; delete n[key]; return n; });
                    setConfirmDeleteCatId(null);
                  } else {
                    setConfirmDeleteCatId(key);
                    setTimeout(() => setConfirmDeleteCatId(null), 3000);
                  }
                }}
                className={\`p-0.5 ml-1 transition-colors \${confirmDeleteCatId === key ? 'text-red-500 bg-red-500/20 rounded' : 'text-red-500 hover:text-red-400'}\`}
                title={confirmDeleteCatId === key ? "クリックして削除" : "削除"}
              >
                <Trash2 className="w-3 h-3" />
              </button>`;

content = content.replace(catBtnRegex, newCatBtn);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
