const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const stateRegex = /const \[editingCategory, setEditingCategory\] = useState<string \| null>\(null\);/;
code = code.replace(stateRegex, `const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editSectionName, setEditSectionName] = useState('');`);

const headerRegex = /<h3 className="text-xs font-mono font-bold uppercase">\s*\{secData\.name\}\s*<\/h3>/m;
const newHeader = `{editingSectionId === Number(secId) ? (
                      <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editSectionName}
                          onChange={(e) => setEditSectionName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onRenameSection?.(Number(secId), editSectionName);
                              setEditingSectionId(null);
                            } else if (e.key === 'Escape') {
                              setEditingSectionId(null);
                            }
                          }}
                          className="text-xs font-mono font-bold uppercase bg-bg-input border border-border-main px-1 py-0.5 rounded outline-none w-32 text-text-main"
                          autoFocus
                          onBlur={() => {
                            onRenameSection?.(Number(secId), editSectionName);
                            setEditingSectionId(null);
                          }}
                        />
                      </div>
                    ) : (
                      <h3 className="text-xs font-mono font-bold uppercase flex items-center group/title cursor-text" onClick={(e) => {
                        if (onRenameSection) {
                          e.stopPropagation();
                          setEditingSectionId(Number(secId));
                          setEditSectionName(secData.name);
                        }
                      }}>
                        {secData.name}
                        {onRenameSection && <Pencil className="w-3 h-3 ml-2 opacity-0 group-hover/title:opacity-100 transition-opacity text-text-dim" />}
                      </h3>
                    )}`;
code = code.replace(headerRegex, newHeader);

// Update draggable conditions so it doesn't drag while editing section
code = code.replace(/draggable=\{editingId === null && editingCategory === null\}/g, "draggable={editingId === null && editingCategory === null && editingSectionId === null}");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
