const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Add editorLineHeight state
const fontSizeStateRegex = /const \[editorFontSize, setEditorFontSize\] = useState\(\(\) => \{[\s\S]*?\}\);/;
const newLineHeightState = `const [editorLineHeight, setEditorLineHeight] = useState(() => {
    const saved = localStorage.getItem('editorLineHeight');
    return saved ? parseFloat(saved) : 1.625;
  });`;

code = code.replace(fontSizeStateRegex, (match) => match + '\n\n  ' + newLineHeightState);

// Add useEffect for editorLineHeight
const fontSizeEffectRegex = /useEffect\(\(\) => \{\s*localStorage\.setItem\('editorFontSize', editorFontSize\.toString\(\)\);\s*\}, \[editorFontSize\]\);/;
const newLineHeightEffect = `useEffect(() => {
    localStorage.setItem('editorLineHeight', editorLineHeight.toString());
  }, [editorLineHeight]);`;

code = code.replace(fontSizeEffectRegex, (match) => match + '\n\n  ' + newLineHeightEffect);

// Add slider to toolbar
const fontConfigRegex = /<div className="flex items-center space-x-1">\s*<button[\s\S]*?<\/button>\s*<\/div>/;
const sliderHTML = `<div className="flex items-center gap-1 mx-2">
          <span className="text-[9px] font-mono text-text-dim">↕</span>
          <input 
            type="range" 
            min="1.0" 
            max="2.5" 
            step="0.1" 
            value={editorLineHeight}
            onChange={e => setEditorLineHeight(parseFloat(e.target.value))}
            className="w-16 h-1 bg-border-main rounded-lg appearance-none cursor-pointer accent-blue-500"
            title={\`Line Height: \${editorLineHeight}\`}
          />
        </div>`;

code = code.replace(fontConfigRegex, (match) => match + '\n        ' + sliderHTML);

// Replace leading-relaxed with inline lineHeight in the 4 places where textarea/divs are rendered
// We can just add lineHeight: editorLineHeight to the style prop
// and remove leading-relaxed from the className.
code = code.replace(/leading-relaxed /g, '');
code = code.replace(/style=\{\{ fontSize: \`\$\{editorFontSize\}px\` \}\}/g, 'style={{ fontSize: `${editorFontSize}px`, lineHeight: editorLineHeight }}');

// Now update the top bar layout
const topBarRegex = /<div className="p-2 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0 gap-2">[\s\S]*?<\/div>\s*<\/div>/;

const newTopBar = `<div className="p-2 border-b border-border-main flex items-center bg-bg-panel shrink-0 gap-2 relative">
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

        {/* Middle: Char count */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center hidden md:flex">
          <span className="text-[9px] text-text-dim font-mono whitespace-nowrap">CHAR: {editorText.length} / 4096</span>
        </div>

        {/* Right side: Copy buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
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
      </div>`;

code = code.replace(topBarRegex, newTopBar);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched layout");
