const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. Import ConfirmModal if not present
if (!content.includes('ConfirmModal')) {
  content = content.replace(
    /import \{ Language, t, translations \} from '\.\.\/i18n';/,
    `import { Language, t, translations } from '../i18n';\nimport { ConfirmModal } from './ConfirmModal';`
  );
}

// 2. Replace the inline button block with just the single button + modal rendering
const inlineButtonRegex = /\{showCopyConfirm \? \([\s\S]*?\)\s*:\s*\([\s\S]*?<\/button>\s*\)\}/;

const newButton = `<button
            onClick={() => setShowCopyConfirm(true)}
            className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0"
            title={lang === 'en' ? "Copy all items to Parts" : "全項目をパーツにコピー"}
          >
            <Copy className="w-3 h-3" />
            {lang === 'en' ? "To Parts" : "パーツへ"}
          </button>
          
          <ConfirmModal
            isOpen={showCopyConfirm}
            message={lang === 'en' ? 'Copy new items to Parts?' : '差分（新規）をパーツへコピーしますか？'}
            onConfirm={() => {
              setShowCopyConfirm(false);
              handleCopyToParts();
            }}
            onCancel={() => setShowCopyConfirm(false)}
            lang={lang}
          />`;

content = content.replace(inlineButtonRegex, newButton);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('Fixed button to use ConfirmModal');
