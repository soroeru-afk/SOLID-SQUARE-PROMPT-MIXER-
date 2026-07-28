const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Add onSaveAsMemo to props
code = code.replace(/onSaveAsPart\?: \(name: string, content: string, category: string, section: number, items\?: \{name: string, content: string\}\[\]\) => void;\n/, "onSaveAsPart?: (name: string, content: string, category: string, section: number, items?: {name: string, content: string}[]) => void;\n  onSaveAsMemo?: (name: string, content: string) => void;\n");

// Add to destructuring
code = code.replace(/onSaveAsMaster,\n  onSaveAsPart,\n/, "onSaveAsMaster,\n  onSaveAsPart,\n  onSaveAsMemo,\n");

// Add button next to Save as Part for POSITIVE
const positiveButtons = /<button \n\s*onClick=\{\(\) => handleSavePartClick\(false\)\}\n\s*className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-\[9px\] font-mono text-text-dim transition-colors"\n\s*>\n\s*<PlusSquare className="w-3 h-3" \/> \{t\('save_as_part', lang\)\}\n\s*<\/button>/;
const newPositiveButtons = `<button 
                onClick={() => handleSavePartClick(false)}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <PlusSquare className="w-3 h-3" /> {t('save_as_part', lang)}
              </button>
              <button 
                onClick={() => {
                  if (onSaveAsMemo) {
                    const text = editorText.trim();
                    if (!text) return;
                    const firstLine = text.split('\\n')[0];
                    const title = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine;
                    onSaveAsMemo(title, text);
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <PlusSquare className="w-3 h-3" /> {t('save_as_memo', lang)}
              </button>`;
code = code.replace(positiveButtons, newPositiveButtons);

// And for NEGATIVE
const negativeButtons = /<button \n\s*onClick=\{\(\) => handleSavePartClick\(true\)\}\n\s*className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-\[9px\] font-mono text-text-dim transition-colors"\n\s*>\n\s*<PlusSquare className="w-3 h-3" \/> \{t\('save_as_part', lang\)\}\n\s*<\/button>/;
const newNegativeButtons = `<button 
                onClick={() => handleSavePartClick(true)}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <PlusSquare className="w-3 h-3" /> {t('save_as_part', lang)}
              </button>
              <button 
                onClick={() => {
                  if (onSaveAsMemo) {
                    const text = negativeEditorText.trim();
                    if (!text) return;
                    const firstLine = text.split('\\n')[0];
                    const title = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine;
                    onSaveAsMemo(title, text);
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <PlusSquare className="w-3 h-3" /> {t('save_as_memo', lang)}
              </button>`;
code = code.replace(negativeButtons, newNegativeButtons);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
