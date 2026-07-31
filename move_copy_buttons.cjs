const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Remove the bottom copy buttons
const bottomBarRegex = /<div className="bg-bg-panel p-2 shrink-0 border-t border-border-main">\s*<div className="flex gap-2 w-full">[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(bottomBarRegex, '');

// 2. Replace the top bar
const topBarRegex = /<div className="p-3 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0">\s*<div className="flex items-center gap-4">\s*<span className="text-\[10px\] font-mono text-text-main font-bold uppercase tracking-widest">\{t\('output_synthesis', lang\)\}<\/span>\s*<button\s*onClick=\{onToggleAutoOptimize\}\s*className=\{\`px-2 py-0\.5 text-\[9px\] font-mono border rounded transition-colors outline-none cursor-pointer \$\{autoOptimize \? 'border-text-main text-text-main' : 'border-text-dim text-text-dim hover:border-text-main hover:text-text-main'\}\`\}\s*>\s*\{t\(autoOptimize \? 'auto_optimize_on' : 'auto_optimize_off', lang\)\}\s*<\/button>\s*<\/div>\s*<span className="text-\[9px\] text-text-dim font-mono">CHAR: \{editorText\.length\} \/ 4096<\/span>\s*<\/div>/;

const newTopBar = `<div className="p-2 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0 gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono text-text-main font-bold uppercase tracking-widest hidden 2xl:inline">{t('output_synthesis', lang)}</span>
          
          <div className="flex items-center bg-bg-surface border border-border-main rounded p-0.5 shadow-sm">
            <span className="text-[9px] font-mono text-text-dim px-2 py-0.5 flex items-center gap-1 font-bold">
              <Copy className="w-3 h-3" /> COPY
            </span>
            <div className="w-px h-3 bg-border-main mx-1"></div>
            <button 
              onClick={() => handleCopy('main')}
              className={\`px-3 py-1 text-[9px] font-mono rounded transition-colors hover:bg-bg-input text-text-main\`}
            >
              {t('copy_main', lang)}
            </button>
            <button 
              onClick={() => handleCopy('negative')}
              className={\`px-3 py-1 text-[9px] font-mono rounded transition-colors hover:bg-bg-input text-text-main\`}
            >
              {t('copy_negative_only', lang)}
            </button>
            <button 
              onClick={() => handleCopy('all')}
              className={\`px-3 py-1 text-[9px] font-mono rounded transition-colors hover:bg-bg-input text-text-main\`}
            >
              {t('copy_all', lang)}
            </button>
          </div>

          <button 
            onClick={onToggleAutoOptimize}
            className={\`px-2 py-1 text-[9px] font-mono border rounded transition-colors outline-none cursor-pointer \${autoOptimize ? 'border-text-main text-text-main' : 'border-text-dim text-text-dim hover:border-text-main hover:text-text-main'}\`}
          >
            {t(autoOptimize ? 'auto_optimize_on' : 'auto_optimize_off', lang)}
          </button>
        </div>
        <span className="text-[9px] text-text-dim font-mono whitespace-nowrap hidden sm:inline">CHAR: {editorText.length} / 4096</span>
      </div>`;

code = code.replace(topBarRegex, newTopBar);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Moved copy buttons to top");
