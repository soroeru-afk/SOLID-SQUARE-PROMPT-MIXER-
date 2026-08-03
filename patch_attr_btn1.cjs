const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const combBtnRegex = /<button \n\s*onClick=\{\(\) => deleteCombination\(c\.id\)\}\n\s*className="text-red-500\/70 hover:text-red-500 hover:bg-red-500\/10 p-1 rounded transition-colors"\n\s*title="削除"\n\s*>\n\s*<Trash2 className="w-3\.5 h-3\.5" \/>\n\s*<\/button>/m;

const newCombBtn = `<button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirmDeleteCombId === c.id) {
                              deleteCombination(c.id);
                              setConfirmDeleteCombId(null);
                            } else {
                              setConfirmDeleteCombId(c.id);
                              setTimeout(() => setConfirmDeleteCombId(null), 3000);
                            }
                          }}
                          className={\`p-1 rounded transition-colors \${confirmDeleteCombId === c.id ? 'text-red-500 bg-red-500/20' : 'text-red-500/70 hover:text-red-500 hover:bg-red-500/10'}\`}
                          title={confirmDeleteCombId === c.id ? "クリックして削除" : "削除"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>`;
content = content.replace(combBtnRegex, newCombBtn);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
