const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const targetBtnRegex = /<button\s+onClick=\{handleFormatVertical\}[\s\S]*?<\/button>/;

const newBtn = `<button 
              onClick={handleFormatVertical}
              className={\`h-[28px] px-3 text-[10px] whitespace-nowrap font-bold font-mono border-2 \${theme === 'light' || theme === 'mono' ? 'bg-gray-200 hover:bg-gray-300 text-black border-gray-400' : 'border-white text-white bg-bg-input hover:bg-white hover:text-black'} rounded transition-colors flex items-center justify-center gap-1.5\`}
              title={lang === 'en' ? "Toggle vertical/horizontal list" : "縦/横リストの切り替え"}
            >
              <List size={14} className={\`\${theme === 'light' || theme === 'mono' ? 'text-black' : ''}\`} />
              {lang === 'en' ? (isVertical ? 'To Horizontal' : 'To Vertical') : (isVertical ? '横並びに戻す' : '縦リストに変換')}
            </button>`;

code = code.replace(targetBtnRegex, newBtn);
fs.writeFileSync('src/components/PreviewColumn.tsx', code, 'utf8');
console.log('patched');
