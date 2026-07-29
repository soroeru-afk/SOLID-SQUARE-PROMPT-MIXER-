const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

const stateRegex = /const \[editContent, setEditContent\] = useState\(''\);/;
code = code.replace(stateRegex, "const [editContent, setEditContent] = useState('');\n  const [editNegativeContent, setEditNegativeContent] = useState<string | undefined>(undefined);");

const startEditRegex = /setEditContent\(master\.content\);\n\s*setEditMark\(master\.mark\);/;
code = code.replace(startEditRegex, "setEditContent(master.content);\n    setEditNegativeContent(master.negativeContent);\n    setEditMark(master.mark);");

const handleSaveRegex = /currentOnUpdate\(id, \{ name: editName, content: editContent, mark: editMark \}\);/;
code = code.replace(handleSaveRegex, "currentOnUpdate(id, { name: editName, content: editContent, mark: editMark, negativeContent: editNegativeContent });");

const jsxRegex = /<textarea \n\s*value=\{editContent\}\n\s*onChange=\{e => setEditContent\(e\.target\.value\)\}\n\s*className=\{`bg-bg-base border border-border-main text-\[11px\] font-mono p-1\.5 rounded text-text-dim focus:outline-none \$\{isNegative \? 'focus:border-red-500' : 'focus:border-blue-500'\} resize-y min-h-\[64px\] h-16`\}\n\s*placeholder=\{t\('content', lang\)\}\n\s*\/>/;
const replaceJsx = `<textarea 
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className={\`bg-bg-base border border-border-main text-[11px] font-mono p-1.5 rounded text-text-dim focus:outline-none \${isNegative ? 'focus:border-red-500' : 'focus:border-blue-500'} resize-y min-h-[64px] h-16\`}
                  placeholder={t('content', lang)}
                />
                {item.negativeContent !== undefined && (
                  <textarea 
                    value={editNegativeContent || ''}
                    onChange={e => setEditNegativeContent(e.target.value)}
                    className={\`bg-bg-base border border-border-main text-[11px] font-mono p-1.5 rounded text-text-dim focus:outline-none focus:border-red-500 resize-y min-h-[64px] h-16\`}
                    placeholder="Negative Content"
                  />
                )}`;
code = code.replace(jsxRegex, replaceJsx);

const itemNameRegex = /\{item\.name\.toUpperCase\(\)\}/;
code = code.replace(itemNameRegex, "{item.name.toUpperCase()}\n                    {item.negativeContent !== undefined && <span className=\"ml-2 text-[8px] bg-accent-main text-white px-1 py-0.5 rounded\">SET</span>}");

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn for SET support");
