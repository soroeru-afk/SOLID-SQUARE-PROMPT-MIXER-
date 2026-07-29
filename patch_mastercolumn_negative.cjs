const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

const regex = /\{item\.negativeContent !== undefined && \(\n\s*<textarea \n\s*value=\{editNegativeContent \|\| ''\}\n\s*onChange=\{e => setEditNegativeContent\(e\.target\.value\)\}\n\s*className=\{`bg-bg-base border border-border-main text-\[11px\] font-mono p-1\.5 rounded text-text-dim focus:outline-none focus:border-red-500 resize-y min-h-\[64px\] h-16`\}\n\s*placeholder="Negative Content"\n\s*\/>\n\s*\)\}/;

const replace = `{!isNegative && (
                  <textarea 
                    value={editNegativeContent || ''}
                    onChange={e => setEditNegativeContent(e.target.value || undefined)}
                    className={\`bg-bg-base border border-border-main text-[11px] font-mono p-1.5 rounded text-text-dim focus:outline-none focus:border-red-500 resize-y min-h-[64px] h-16\`}
                    placeholder="NEGATIVE PROMPT"
                  />
                )}`;

code = code.replace(regex, replace);

// Also update handleSave so empty editNegativeContent becomes undefined
const handleSaveRegex = /currentOnUpdate\(id, \{ name: editName, content: editContent, mark: editMark, negativeContent: editNegativeContent \}\);/;
code = code.replace(handleSaveRegex, "currentOnUpdate(id, { name: editName, content: editContent, mark: editMark, negativeContent: editNegativeContent && editNegativeContent.trim() !== '' ? editNegativeContent : undefined });");

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn negative text");
