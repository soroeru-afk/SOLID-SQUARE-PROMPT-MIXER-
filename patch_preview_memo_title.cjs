const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// PROMPT memo
const promptMemoRegex = /onClick=\{\(\) => \{\n\s*const text = editorText\.trim\(\);\n\s*if \(\!text\) return;\n\s*const firstLine = text\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*setSaveMemoContent\(text\);\n\s*setSaveMemoDefaultTitle\(title\);\n\s*setIsSaveMemoModalOpen\(true\);\n\s*\}\}/;

code = code.replace(promptMemoRegex, `onClick={() => {
                  const text = editorText.trim();
                  if (!text) return;
                  const firstLine = text.split('\\n')[0];
                  const title = selectedMemoId && selectedMemoName ? selectedMemoName : (firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine);
                  setSaveMemoContent(text);
                  setSaveMemoDefaultTitle(title);
                  setIsSaveMemoModalOpen(true);
                }}`);

// NEGATIVE PROMPT memo
const negativeMemoRegex = /onClick=\{\(\) => \{\n\s*const text = negativeEditorText\.trim\(\);\n\s*if \(\!text\) return;\n\s*const firstLine = text\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*setSaveMemoContent\(text\);\n\s*setSaveMemoDefaultTitle\(title\);\n\s*setIsSaveMemoModalOpen\(true\);\n\s*\}\}/;

code = code.replace(negativeMemoRegex, `onClick={() => {
                  const text = negativeEditorText.trim();
                  if (!text) return;
                  const firstLine = text.split('\\n')[0];
                  const title = selectedMemoId && selectedMemoName ? selectedMemoName : (firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine);
                  setSaveMemoContent(text);
                  setSaveMemoDefaultTitle(title);
                  setIsSaveMemoModalOpen(true);
                }}`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
