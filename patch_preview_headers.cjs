const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Replace top PROMPT header
const topHeaderRegex = /<div className="absolute top-2 left-3 right-2 flex justify-between items-center pointer-events-none">\n\s*<span className=\{\`text-\[9px\] font-mono font-bold uppercase \$\{paperMode \? 'text-gray-400' : 'text-text-dim\/50'\}\`\}>PROMPT<\/span>\n\s*<div className="flex items-center gap-2 pointer-events-auto">/g;
const newTopHeader = `<div className="flex justify-between items-start sm:items-center px-3 pt-2 pb-1 gap-2 flex-wrap border-b border-border-main/30">
            <span className={\`text-[9px] font-mono font-bold uppercase mt-1 \${paperMode ? 'text-gray-400' : 'text-text-dim/50'}\`}>PROMPT</span>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <button
                onClick={() => setEditorText('')}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-red-500/10 hover:text-red-400 border border-border-hover hover:border-red-500/30 rounded text-[9px] font-mono text-text-dim transition-colors"
                title={t('clear', lang)}
              >
                <Trash2 className="w-3 h-3" />
              </button>`;

code = code.replace(topHeaderRegex, newTopHeader);

// Remove the mt-6 on the positive textarea container
code = code.replace(/<div className="flex-1 relative flex flex-col mt-6">/, '<div className="flex-1 relative flex flex-col mt-1">');

// Replace NEGATIVE PROMPT header
const negativeHeaderRegex = /<div className="absolute top-2 left-3 right-2 flex justify-between items-center pointer-events-none">\n\s*<span className=\{\`text-\[9px\] font-mono font-bold uppercase \$\{paperMode \? 'text-gray-400' : 'text-text-dim\/50'\}\`\}>NEGATIVE PROMPT<\/span>\n\s*<div className="flex items-center gap-2 pointer-events-auto">/g;
const newNegativeHeader = `<div className="flex justify-between items-start sm:items-center px-3 pt-2 pb-1 gap-2 flex-wrap border-b border-border-main/30">
            <span className={\`text-[9px] font-mono font-bold uppercase mt-1 \${paperMode ? 'text-gray-400' : 'text-text-dim/50'}\`}>NEGATIVE PROMPT</span>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <button
                onClick={() => setNegativeEditorText('')}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-red-500/10 hover:text-red-400 border border-border-hover hover:border-red-500/30 rounded text-[9px] font-mono text-text-dim transition-colors"
                title={t('clear', lang)}
              >
                <Trash2 className="w-3 h-3" />
              </button>`;

code = code.replace(negativeHeaderRegex, newNegativeHeader);

// Remove the mt-6 on the negative textarea container
code = code.replace(/<div className="flex-1 relative flex flex-col mt-6">/, '<div className="flex-1 relative flex flex-col mt-1">');

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
