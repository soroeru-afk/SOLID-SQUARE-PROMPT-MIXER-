const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. Make textarea resizable
code = code.replace(
  /className="w-full bg-bg-surface border border-border-main rounded px-2 py-1 text-\[11px\] text-text-main font-mono h-\[40px\] resize-none"/,
  'className="w-full bg-bg-surface border border-border-main rounded px-2 py-1 text-[11px] text-text-main font-mono h-[40px] resize-y min-h-[40px]"'
);

// 2. Add buttons to the top
const buttonsBlock = `
      <div className="flex gap-2 pb-3 mb-1 border-b border-border-main">
        <button 
          onClick={handleReset}
          className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded text-[13px] font-mono font-bold transition-colors"
        >
          リセット
        </button>
        <button 
          onClick={handleApply}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-[13px] font-mono font-bold transition-colors flex items-center justify-center gap-1"
        >
          <Check className="w-4 h-4" /> 適用する
        </button>
      </div>`;

code = code.replace(
  /<div className="flex flex-col gap-1.5 border-b border-border-main pb-3 mb-1 mt-2">/,
  buttonsBlock + '\n\n      <div className="flex flex-col gap-1.5 border-b border-border-main pb-3 mb-1 mt-2">'
);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
