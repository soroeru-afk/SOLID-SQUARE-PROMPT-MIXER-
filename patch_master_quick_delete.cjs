const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

code = code.replace(
  /const \[confirmDeleteId, setConfirmDeleteId\] = useState<string \| null>\(null\);/,
  "const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);\n  const [confirmQuickDeleteId, setConfirmQuickDeleteId] = useState<string | null>(null);"
);

const trashBtn = `<button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    if (confirmQuickDeleteId === item.id) {
                      currentOnDelete(item.id);
                      setConfirmQuickDeleteId(null);
                    } else {
                      setConfirmQuickDeleteId(item.id);
                      setTimeout(() => setConfirmQuickDeleteId(null), 3000);
                    }
                  }}
                  className={\`p-1.5 transition-colors \${
                    confirmQuickDeleteId === item.id 
                      ? 'text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 opacity-100' 
                      : 'text-text-dim hover:text-red-400 hover:bg-bg-input'
                  }\`}
                  title={confirmQuickDeleteId === item.id ? "Confirm delete" : "Delete"}
                ><Trash2 className="w-3 h-3" /></button>`;

code = code.replace(
  /<button \n\s*onClick=\{\(e\) => startEdit\(item, e\)\}\n\s*className=\{`p-1\.5 text-text-dim \$\{isNegative \? 'hover:text-red-400' : 'hover:text-blue-400'\} hover:bg-bg-input transition-colors`\}\n\s*><Pencil className="w-3 h-3" \/><\/button>/,
  trashBtn + "\n                <button \n                  onClick={(e) => startEdit(item, e)}\n                  className={`p-1.5 text-text-dim ${isNegative ? 'hover:text-red-400' : 'hover:text-blue-400'} hover:bg-bg-input transition-colors`}\n                ><Pencil className=\"w-3 h-3\" /></button>"
);

code = code.replace(
  /className="absolute top-2 right-6 opacity-0 group-hover:opacity-100 flex items-center transition-opacity bg-bg-panel rounded shadow-sm border border-border-main overflow-hidden"/,
  "className={`absolute top-2 right-6 ${confirmQuickDeleteId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} flex items-center transition-opacity bg-bg-panel rounded shadow-sm border border-border-main overflow-hidden`}"
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn");
