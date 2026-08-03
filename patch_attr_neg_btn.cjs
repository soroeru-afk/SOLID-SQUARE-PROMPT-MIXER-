const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const oldBtnRegex = /<button\s*onClick=\{\(\) => \{\s*const id = 'custom_neg_' \+ Date\.now\(\);\s*setCategories\(prev => \[\.\.\.prev, \{ id, label: '新規ネガティブ', isNegative: true \}\]\);\s*setPresets\(prev => \(\{ \.\.\.prev, \[id\]: \[\{ label: '指定なし \/ None', value: '' \}\] \}\)\);\s*\}\}\s*className="px-2 py-1 bg-red-500\/10 hover:bg-red-500\/20 border border-red-500\/30 rounded text-\[11px\] font-bold flex items-center gap-1 transition-colors text-red-400"\s*>\s*<Plus className="w-3 h-3" \/> ネガティブ追加\s*<\/button>/m;

const buttonString = `<button
          onClick={() => {
            const id = 'custom_neg_' + Date.now();
            setCategories(prev => [...prev, { id, label: '新規ネガティブ', isNegative: true }]);
            setPresets(prev => ({ ...prev, [id]: [{ label: '指定なし / None', value: '' }] }));
          }}
          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-[11px] font-bold flex items-center gap-1 transition-colors text-red-400 self-end"
        >
          <Plus className="w-3 h-3" /> ネガティブ追加
        </button>`;

content = content.replace(oldBtnRegex, '');

const negPromptRegex = /(<div className="flex flex-col gap-1\.5 pt-2 border-t border-border-main mt-2">\s*<label className="text-\[13px\] font-bold text-text-main font-mono">⛔ ネガティブプロンプト \(自由入力\)<\/label>\s*<textarea\s*value=\{negativePrompt\}\s*onChange=\{e => setNegativePrompt\(e\.target\.value\)\}\s*placeholder="ネガティブプロンプトを追加\.\.\."\s*className="w-full bg-bg-input border border-border-main rounded px-2 py-1\.5 text-\[13px\] text-text-main font-mono min-h-\[60px\] resize-y"\s*\/>)/;

content = content.replace(negPromptRegex, `$1\n        ${buttonString}`);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
