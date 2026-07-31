const fs = require('fs');
let code = fs.readFileSync('src/components/AddModal.tsx', 'utf8');

code = code.replace(
  /onConfirm: \(name: string\) => void;/,
  "onConfirm: (name: string, content?: string) => void;\n  showContentField?: boolean;"
);

code = code.replace(
  /export const AddModal: React.FC<AddModalProps> = \(\{ isOpen, title, onConfirm, onCancel, lang \}\) => \{/,
  "export const AddModal: React.FC<AddModalProps> = ({ isOpen, title, onConfirm, onCancel, lang, showContentField = false }) => {"
);

code = code.replace(
  /const \[name, setName\] = useState\(''\);/,
  "const [name, setName] = useState('');\n  const [content, setContent] = useState('');"
);

code = code.replace(
  /if \(isOpen\) \{\n      setName\(''\);\n    \}/,
  "if (isOpen) {\n      setName('');\n      setContent('');\n    }"
);

code = code.replace(
  /if \(e.key === 'Enter' && name.trim\(\)\) \{\n                  onConfirm\(name.trim\(\)\);\n                \}/,
  "if (e.key === 'Enter' && name.trim()) {\n                  onConfirm(name.trim(), showContentField ? content : undefined);\n                }"
);

code = code.replace(
  /if \(name.trim\(\)\) onConfirm\(name.trim\(\)\);/,
  "if (name.trim()) onConfirm(name.trim(), showContentField ? content : undefined);"
);

code = code.replace(
  /<input\n              value=\{name\}/,
  "{showContentField ? (\n              <div className=\"flex flex-col gap-3 mb-6\">\n                <input\n                  value={name}\n                  onChange={e => setName(e.target.value)}\n                  className=\"bg-bg-base border border-border-main text-sm font-mono p-2 rounded text-text-main focus:outline-none focus:border-blue-500 w-full\"\n                  placeholder={t('name', lang)}\n                  autoFocus\n                  onKeyDown={e => {\n                    if (e.key === 'Enter' && name.trim()) {\n                      onConfirm(name.trim(), content);\n                    } else if (e.key === 'Escape') {\n                      onCancel();\n                    }\n                  }}\n                />\n                <textarea\n                  value={content}\n                  onChange={e => setContent(e.target.value)}\n                  className=\"bg-bg-base border border-border-main text-sm font-mono p-2 rounded text-text-main focus:outline-none focus:border-blue-500 w-full h-24 resize-none\"\n                  placeholder={t('placeholder', lang)}\n                  onKeyDown={e => {\n                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && name.trim()) {\n                      onConfirm(name.trim(), content);\n                    } else if (e.key === 'Escape') {\n                      onCancel();\n                    }\n                  }}\n                />\n              </div>\n            ) : (\n              <input\n                value={name}"
);

code = code.replace(
  /onCancel\(\);\n                \}\n              \}\}\n            \/>/,
  "onCancel();\n                }\n              }}\n            />\n            )}"
);

fs.writeFileSync('src/components/AddModal.tsx', code);
console.log("Patched AddModal");
