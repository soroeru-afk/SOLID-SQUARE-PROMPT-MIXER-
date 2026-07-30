const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /const \[confirmDeleteId, setConfirmDeleteId\] = useState<string \| null>\(null\);/,
  "const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);\n  const [confirmQuickDeleteId, setConfirmQuickDeleteId] = useState<string | null>(null);"
);

const trashBtn = `<button 
                                    onClick={(e) => { 
                                      e.preventDefault(); 
                                      e.stopPropagation(); 
                                      if (confirmQuickDeleteId === part.id) {
                                        onDelete(part.id);
                                        setConfirmQuickDeleteId(null);
                                      } else {
                                        setConfirmQuickDeleteId(part.id);
                                        setTimeout(() => setConfirmQuickDeleteId(null), 3000);
                                      }
                                    }}
                                    className={\`transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main \${
                                      confirmQuickDeleteId === part.id 
                                        ? 'opacity-100 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                                        : 'opacity-0 group-hover:opacity-100 text-text-dim hover:text-red-400 hover:bg-bg-input'
                                    }\`}
                                    title={confirmQuickDeleteId === part.id ? "Confirm delete" : "Delete"}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>`;

code = code.replace(
  /<button \n\s*onClick=\{\(e\) => startEdit\(part, e\)\}\n\s*className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-blue-400 transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main"\n\s*>\n\s*<Pencil className="w-3 h-3" \/>\n\s*<\/button>/,
  trashBtn + "\n                                  <button \n                                    onClick={(e) => startEdit(part, e)}\n                                    className=\"opacity-0 group-hover:opacity-100 text-text-dim hover:text-blue-400 transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main\"\n                                  >\n                                    <Pencil className=\"w-3 h-3\" />\n                                  </button>"
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn");
