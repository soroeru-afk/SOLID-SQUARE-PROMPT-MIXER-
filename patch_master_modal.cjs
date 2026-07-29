const fs = require('fs');
let code = fs.readFileSync('src/components/SaveMasterModal.tsx', 'utf8');

code = code.replace(/isNegative: boolean;\n\s*onConfirm: \(title: string, content: string, isNegative: boolean, items\?: \{name: string, content: string\}\[\], negativeContent\?: string\) => void;/,
  "isNegative: boolean;\n  selectedId?: string | null;\n  selectedName?: string;\n  onConfirm: (title: string, content: string, isNegative: boolean, items?: {name: string, content: string}[], negativeContent?: string, isUpdate?: boolean) => void;");

code = code.replace(/export const SaveMasterModal: React\.FC<SaveMasterModalProps> = \(\{ isOpen, content, negativeContent, defaultTitle, items, isNegative, onConfirm, onCancel, lang \}\) => \{/,
  "export const SaveMasterModal: React.FC<SaveMasterModalProps> = ({ isOpen, content, negativeContent, defaultTitle, items, isNegative, selectedId, selectedName, onConfirm, onCancel, lang }) => {");

code = code.replace(/const handleConfirm = \(\) => \{[\s\S]*?\};\n/, "");

const buttonsRegex = /<button\n\s*onClick=\{handleConfirm\}\n\s*disabled=\{!isBulk && !title\.trim\(\)\}\n\s*className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-\[11px\] font-mono font-bold rounded transition-colors disabled:opacity-50"\n\s*>\n\s*\{t\('confirm', lang\)\}\n\s*<\/button>/;

const replaceButtons = `{selectedId && !isBulk && (
                <button
                  onClick={() => onConfirm(title.trim() || selectedName || '', content || '', isNegative, items, negativeContent, true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono font-bold rounded transition-colors"
                  title={\`Update: \${selectedName}\`}
                >
                  {t('update_current', lang)}
                </button>
              )}
              <button
                onClick={() => onConfirm(title.trim(), content || '', isNegative, items, negativeContent, false)}
                disabled={!isBulk && !title.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded transition-colors disabled:opacity-50"
              >
                {t('save_as_new', lang)}
              </button>`;

code = code.replace(buttonsRegex, replaceButtons);

fs.writeFileSync('src/components/SaveMasterModal.tsx', code);
console.log("Patched SaveMasterModal");
