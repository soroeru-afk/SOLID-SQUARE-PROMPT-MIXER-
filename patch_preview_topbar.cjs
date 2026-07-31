const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const topBarRegex = /<div className="p-2 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0 gap-2">[\s\S]*?<span className="text-\[9px\] text-text-dim font-mono whitespace-nowrap hidden sm:inline">CHAR: \{editorText\.length\} \/ 4096<\/span>\s*<\/div>/;

const newTopBar = `<div className="p-2 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0 gap-2">
        {/* Left side: Title and Auto Optimize */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono text-text-main font-bold uppercase tracking-widest hidden 2xl:inline">{t('output_synthesis', lang)}</span>
          <button 
            onClick={onToggleAutoOptimize}
            className={\`px-2 py-1 text-[9px] font-mono border rounded transition-colors outline-none cursor-pointer \${autoOptimize ? 'border-text-main text-text-main' : 'border-text-dim text-text-dim hover:border-text-main hover:text-text-main'}\`}
          >
            {t(autoOptimize ? 'auto_optimize_on' : 'auto_optimize_off', lang)}
          </button>
        </div>

        {/* Right side: Copy buttons and Char count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-text-dim mr-1 flex items-center gap-1 font-bold">
              <Copy className="w-3.5 h-3.5" /> COPY
            </span>
            <button 
              onClick={() => handleCopy('main')}
              className="px-6 py-1.5 text-[10px] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white"
            >
              {t('copy_main', lang)}
            </button>
            <button 
              onClick={() => handleCopy('negative')}
              className="px-6 py-1.5 text-[10px] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white"
            >
              {t('copy_negative_only', lang)}
            </button>
            <button 
              onClick={() => handleCopy('all')}
              className="px-6 py-1.5 text-[10px] font-mono font-bold rounded transition-colors bg-gray-500 hover:bg-gray-400 active:bg-gray-600 text-white"
            >
              {t('copy_all', lang)}
            </button>
          </div>
          <div className="w-px h-4 bg-border-main mx-1"></div>
          <span className="text-[9px] text-text-dim font-mono whitespace-nowrap hidden sm:inline">CHAR: {editorText.length} / 4096</span>
        </div>
      </div>`;

code = code.replace(topBarRegex, newTopBar);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn top bar");
