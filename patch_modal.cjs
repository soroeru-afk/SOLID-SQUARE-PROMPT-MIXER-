const fs = require('fs');
let code = fs.readFileSync('src/components/SaveMasterModal.tsx', 'utf8');

code = code.replace(/content\?: string;/, "content?: string;\n  negativeContent?: string;");
code = code.replace(/onConfirm: \(title: string, content: string, isNegative: boolean, items\?: \{name: string, content: string\}\[\]\) => void;/, "onConfirm: (title: string, content: string, isNegative: boolean, items?: {name: string, content: string}[], negativeContent?: string) => void;");
code = code.replace(/export const SaveMasterModal: React\.FC<SaveMasterModalProps> = \(\{ isOpen, content, defaultTitle, items, isNegative, onConfirm, onCancel, lang \}\) => \{/, "export const SaveMasterModal: React.FC<SaveMasterModalProps> = ({ isOpen, content, negativeContent, defaultTitle, items, isNegative, onConfirm, onCancel, lang }) => {");

code = code.replace(/onConfirm\(title\.trim\(\), content \|\| '', isNegative, items\);/, "onConfirm(title.trim(), content || '', isNegative, items, negativeContent);");

code = code.replace(/\{isBulk \? `Save \$\{items\.length\} items to \$\{isNegative \? 'negative prompts' : 'master prompts'\}` : \(isNegative \? t\('save_to_negative', lang\) : t\('save_as_master', lang\)\)\}/, "{isBulk ? `Save ${items.length} items to ${isNegative ? 'negative prompts' : 'master prompts'}` : (negativeContent !== undefined ? t('save_as_set', lang) : (isNegative ? t('save_to_negative', lang) : t('save_as_master', lang)))}");

const contentDivRegex = /\{!isBulk && \(\n\s*<div>\n\s*<label className="block text-\[10px\] font-mono text-text-dim mb-1">\{t\('content', lang\)\}<\/label>\n\s*<div className="bg-bg-base border border-border-main text-text-dim text-\[10px\] font-mono p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">\n\s*\{content\}\n\s*<\/div>\n\s*<\/div>\n\s*\)\}/;

const newContentDiv = `{!isBulk && (
              <div>
                <label className="block text-[10px] font-mono text-text-dim mb-1">{t('content', lang)}</label>
                <div className="bg-bg-base border border-border-main text-text-dim text-[10px] font-mono p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {content}
                </div>
                {negativeContent !== undefined && (
                  <>
                    <label className="block text-[10px] font-mono text-text-dim mb-1 mt-2">NEGATIVE PROMPT</label>
                    <div className="bg-bg-base border border-border-main text-text-dim text-[10px] font-mono p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {negativeContent}
                    </div>
                  </>
                )}
              </div>
            )}`;
code = code.replace(contentDivRegex, newContentDiv);

fs.writeFileSync('src/components/SaveMasterModal.tsx', code);
console.log("Patched modal");
