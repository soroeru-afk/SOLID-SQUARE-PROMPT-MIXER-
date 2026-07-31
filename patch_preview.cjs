const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Fix the copy buttons and character count
// We want to make the buttons the same width (w-24) and fix the character count width (w-[110px] text-right)
const topBarRegex = /<div className="flex items-center gap-3">\s*<div className="flex items-center gap-1\.5">\s*<span className="text-\[10px\] font-mono text-text-dim mr-1 flex items-center gap-1 font-bold">\s*<Copy className="w-3\.5 h-3\.5" \/> COPY\s*<\/span>\s*<button \s*onClick=\{\(\) => handleCopy\('main'\)\}\s*className="px-6 py-1\.5 text-\[10px\] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white"\s*>\s*\{t\('copy_main', lang\)\}\s*<\/button>\s*<button \s*onClick=\{\(\) => handleCopy\('negative'\)\}\s*className="px-6 py-1\.5 text-\[10px\] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white"\s*>\s*\{t\('copy_negative_only', lang\)\}\s*<\/button>\s*<button \s*onClick=\{\(\) => handleCopy\('all'\)\}\s*className="px-6 py-1\.5 text-\[10px\] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white"\s*>\s*\{t\('copy_all', lang\)\}\s*<\/button>\s*<\/div>\s*<div className="w-px h-4 bg-border-main mx-1"><\/div>\s*<span className="text-\[9px\] text-text-dim font-mono whitespace-nowrap hidden sm:inline">CHAR: \{editorText\.length\} \/ 4096<\/span>\s*<\/div>/;

const newTopBar = `<div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-text-dim mr-1 flex items-center gap-1 font-bold">
              <Copy className="w-3.5 h-3.5" /> COPY
            </span>
            <button 
              onClick={() => handleCopy('main')}
              className="w-24 py-1.5 text-[10px] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white text-center"
            >
              {t('copy_main', lang)}
            </button>
            <button 
              onClick={() => handleCopy('negative')}
              className="w-24 py-1.5 text-[10px] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white text-center"
            >
              {t('copy_negative_only', lang)}
            </button>
            <button 
              onClick={() => handleCopy('all')}
              className="w-24 py-1.5 text-[10px] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white text-center"
            >
              {t('copy_all', lang)}
            </button>
          </div>
          <div className="w-px h-4 bg-border-main mx-1"></div>
          <span className="text-[9px] text-text-dim font-mono whitespace-nowrap hidden sm:inline w-[110px] text-right">CHAR: {editorText.length} / 4096</span>
        </div>`;

code = code.replace(topBarRegex, newTopBar);

// 2. Move the toast notification to the top
const toastRegex = /className="absolute bottom-20 right-4 bg-bg-surface text-text-main px-4 py-2 rounded shadow-lg text-\[10px\] font-mono font-bold flex items-center gap-2 border border-border-main"/;
const newToastClass = 'className="absolute top-16 right-4 bg-bg-surface text-text-main px-4 py-2 rounded shadow-lg text-[10px] font-mono font-bold flex items-center gap-2 border border-border-main"';
code = code.replace(toastRegex, newToastClass);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn top bar and toast");
