const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// PROMPT header
const promptClearRegex = /<button\n\s*onClick=\{\(\) => setEditorText\(''\)\}\n\s*className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-red-500\/10 hover:text-red-400 border border-border-hover hover:border-red-500\/30 rounded text-\[9px\] font-mono text-text-dim transition-colors"\n\s*title=\{t\('clear', lang\)\}\n\s*>\n\s*<Trash2 className="w-3 h-3" \/>\n\s*<\/button>/;

code = code.replace(promptClearRegex, "");

const promptMemoRegex = /<button \n\s*onClick=\{\(\) => \{\n\s*const text = editorText\.trim\(\);\n\s*if \(\!text\) return;\n\s*const firstLine = text\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*setSaveMemoContent\(text\);\n\s*setSaveMemoDefaultTitle\(title\);\n\s*setIsSaveMemoModalOpen\(true\);\n\s*\}\}\n\s*className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-\[9px\] font-mono text-text-dim transition-colors"\n\s*>\n\s*<PlusSquare className="w-3 h-3" \/> \{t\('save_as_memo', lang\)\}\n\s*<\/button>/;

code = code.replace(promptMemoRegex, `$&
              <button
                onClick={() => setEditorText('')}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-red-500/10 hover:text-red-400 border border-border-hover hover:border-red-500/30 rounded text-[9px] font-mono text-text-dim transition-colors ml-1"
                title={t('clear', lang)}
              >
                <Trash2 className="w-3 h-3" />
              </button>`);

// NEGATIVE PROMPT header
const negativeClearRegex = /<button\n\s*onClick=\{\(\) => setNegativeEditorText\(''\)\}\n\s*className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-red-500\/10 hover:text-red-400 border border-border-hover hover:border-red-500\/30 rounded text-\[9px\] font-mono text-text-dim transition-colors"\n\s*title=\{t\('clear', lang\)\}\n\s*>\n\s*<Trash2 className="w-3 h-3" \/>\n\s*<\/button>/;

code = code.replace(negativeClearRegex, "");

const negativeMemoRegex = /<button \n\s*onClick=\{\(\) => \{\n\s*const text = negativeEditorText\.trim\(\);\n\s*if \(\!text\) return;\n\s*const firstLine = text\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*setSaveMemoContent\(text\);\n\s*setSaveMemoDefaultTitle\(title\);\n\s*setIsSaveMemoModalOpen\(true\);\n\s*\}\}\n\s*className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-\[9px\] font-mono text-text-dim transition-colors"\n\s*>\n\s*<PlusSquare className="w-3 h-3" \/> \{t\('save_as_memo', lang\)\}\n\s*<\/button>/;

code = code.replace(negativeMemoRegex, `$&
              <button
                onClick={() => setNegativeEditorText('')}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-red-500/10 hover:text-red-400 border border-border-hover hover:border-red-500/30 rounded text-[9px] font-mono text-text-dim transition-colors ml-1"
                title={t('clear', lang)}
              >
                <Trash2 className="w-3 h-3" />
              </button>`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
