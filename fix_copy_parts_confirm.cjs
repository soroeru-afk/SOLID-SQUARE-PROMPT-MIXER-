const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. Add state variable for the confirm
content = content.replace(
  /const \[saveSuccessMessage, setSaveSuccessMessage\] = useState<string \| null>\(null\);/,
  `const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);\n  const [showCopyConfirm, setShowCopyConfirm] = useState(false);`
);

// 2. Remove window.confirm from handleCopyToParts
content = content.replace(
  /const confirmMessage = lang === 'en' \? 'Copy all items to Parts\?' : 'すべての項目をパーツへコピーしますか？\\n（同じ内容のものはスキップされます）';\s*if \(\!window\.confirm\(confirmMessage\)\) return;/,
  `setShowCopyConfirm(false);`
);

// 3. Update the button rendering to show the confirm state
const oldButton = `<button
            onClick={handleCopyToParts}
            className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
            title={lang === 'en' ? "Copy all items to Parts" : "全項目をパーツにコピー"}
          >
            <Copy className="w-3 h-3" />
            {lang === 'en' ? "To Parts" : "パーツへ"}
          </button>`;

const newButton = `{showCopyConfirm ? (
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-blue-500 mr-1">{lang === 'en' ? 'Copy all?' : '全コピーしますか?'}</span>
              <button
                onClick={handleCopyToParts}
                className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 border border-blue-500/50 rounded text-[11px] font-bold transition-colors"
              >
                {lang === 'en' ? 'Yes' : 'はい'}
              </button>
              <button
                onClick={() => setShowCopyConfirm(false)}
                className="px-2 py-1 bg-gray-500/10 hover:bg-gray-500/20 text-gray-500 border border-gray-500/30 rounded text-[11px] transition-colors"
              >
                {lang === 'en' ? 'No' : 'いいえ'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCopyConfirm(true)}
              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
              title={lang === 'en' ? "Copy all items to Parts" : "全項目をパーツにコピー"}
            >
              <Copy className="w-3 h-3" />
              {lang === 'en' ? "To Parts" : "パーツへ"}
            </button>
          )}`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('Fixed copy to parts confirmation');
