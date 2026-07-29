const fs = require('fs');
let code = fs.readFileSync('src/components/SavePartModal.tsx', 'utf8');

code = code.replace(/categories: \[string, number\]\[\]; \/\/ \[category, section\]\n\s*onConfirm: \(name: string, category: string, section: number, items\?: \{name: string, content: string\}\[\]\) => void;/,
  "categories: [string, number][]; // [category, section]\n  selectedId?: string | null;\n  selectedName?: string;\n  onConfirm: (name: string, category: string, section: number, items?: {name: string, content: string}[], isUpdate?: boolean) => void;");

code = code.replace(/export const SavePartModal: React\.FC<SavePartModalProps> = \(\{ isOpen, content, defaultName, items, categories, onConfirm, onCancel, lang \}\) => \{/,
  "export const SavePartModal: React.FC<SavePartModalProps> = ({ isOpen, content, defaultName, items, categories, selectedId, selectedName, onConfirm, onCancel, lang }) => {");

code = code.replace(/const handleConfirm = \(\) => \{[\s\S]*?\};\n/, "");

const buttonsRegex = /<button\n\s*onClick=\{handleConfirm\}\n\s*disabled=\{\(!isBulk && !name\.trim\(\)\) \|\| !selectedCat\}\n\s*className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-\[11px\] font-mono font-bold rounded transition-colors disabled:opacity-50"\n\s*>\n\s*\{t\('confirm', lang\)\}\n\s*<\/button>/;

const replaceButtons = `{selectedId && !isBulk && (
                <button
                  onClick={() => {
                    const [sectionStr, ...catParts] = selectedCat.split(':');
                    const categoryName = catParts.join(':');
                    onConfirm(name.trim() || selectedName || '', categoryName, Number(sectionStr), items, true);
                  }}
                  disabled={!selectedCat}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono font-bold rounded transition-colors disabled:opacity-50"
                  title={\`Update: \${selectedName}\`}
                >
                  {t('update_current', lang)}
                </button>
              )}
              <button
                onClick={() => {
                  const [sectionStr, ...catParts] = selectedCat.split(':');
                  const categoryName = catParts.join(':');
                  onConfirm(name.trim(), categoryName, Number(sectionStr), items, false);
                }}
                disabled={(!isBulk && !name.trim()) || !selectedCat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded transition-colors disabled:opacity-50"
              >
                {t('save_as_new', lang)}
              </button>`;

code = code.replace(buttonsRegex, replaceButtons);

fs.writeFileSync('src/components/SavePartModal.tsx', code);
console.log("Patched SavePartModal");
