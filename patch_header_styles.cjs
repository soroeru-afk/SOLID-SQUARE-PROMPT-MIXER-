const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader = `<div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main text-text-main rounded transition-colors flex items-center justify-center shrink-0"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setSidebarSwapped(s => !s)}
            className="w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main text-text-main rounded transition-colors flex items-center justify-center shrink-0"
            title="Swap Sidebars"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'black' : t === 'black' ? 'red' : t === 'red' ? 'light' : t === 'light' ? 'navy' : 'dark')}
            className="bg-bg-input hover:bg-border-main border border-border-main text-[10px] font-mono text-text-main rounded px-3 py-1 outline-none mr-2 transition-colors flex items-center h-[26px]"
          >
            {t('theme', lang)}: {t(\`theme_\${theme}\` as keyof typeof translations, lang)}
          </button>
          <button 
            onClick={() => setPaperMode(!paperMode)}
            className={\`text-[10px] font-mono border rounded px-3 py-1 outline-none mr-4 transition-colors flex items-center h-[26px] \${paperMode ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-bg-input hover:bg-border-main border-border-main text-text-dim'}\`}
          >
            {t('paper_mode', lang)}: {paperMode ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => setLang(l => l === 'en' ? 'ja' : 'en')}
            className="flex items-center px-3 h-[26px] bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-main rounded text-text-dim transition-colors"
          >
            {lang === 'en' ? 'JP' : 'EN'}
          </button>
        </div>`;

const newHeader = `<div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main text-text-main rounded transition-colors flex items-center justify-center shrink-0"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setSidebarSwapped(s => !s)}
            className="w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main text-text-main rounded transition-colors flex items-center justify-center shrink-0"
            title="Swap Sidebars"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'black' : t === 'black' ? 'red' : t === 'red' ? 'light' : t === 'light' ? 'navy' : 'dark')}
            className="h-7 bg-bg-input hover:bg-border-main border border-border-main text-[10px] font-mono text-text-main rounded px-2.5 transition-colors flex items-center justify-center shrink-0"
          >
            {t('theme', lang)}: {t(\`theme_\${theme}\` as keyof typeof translations, lang)}
          </button>
          <button 
            onClick={() => setPaperMode(!paperMode)}
            className={\`h-7 text-[10px] font-mono border rounded px-2.5 transition-colors flex items-center justify-center shrink-0 \${paperMode ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold' : 'bg-bg-input hover:bg-border-main border-border-main text-text-main'}\`}
          >
            {t('paper_mode', lang)}: {paperMode ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => setLang(l => l === 'en' ? 'ja' : 'en')}
            className="h-7 px-2.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-main rounded text-text-main transition-colors flex items-center justify-center shrink-0"
          >
            {lang === 'en' ? 'JP' : 'EN'}
          </button>
        </div>`;

code = code.replace(oldHeader, newHeader);

fs.writeFileSync('src/App.tsx', code);
console.log("Header styles patched");
