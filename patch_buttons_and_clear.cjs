const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexMerge = /<button \n          onClick=\{handleMergeDupes\}[\s\S]*?\{t\('merge_dupes', lang\)\}\n        <\/button>/m;

const newMerge = `<button 
          onClick={handleMergeDupes}
          className={\`px-3 py-1.5 text-[10px] font-mono border rounded transition-colors \${
            theme === 'light' 
              ? 'bg-[#3b5323]/10 hover:bg-[#3b5323]/20 border-[#3b5323]/60 text-[#3b5323]' 
              : 'bg-[#7a9a5a]/10 hover:bg-[#7a9a5a]/20 border-[#7a9a5a]/50 text-[#9bb87d]'
          }\`}
          title="Merge duplicate phrases"
        >
          {t('merge_dupes', lang)}
        </button>
        <button 
          onClick={handleClearAllWeights}
          className={\`px-3 py-1.5 text-[10px] font-mono border rounded transition-colors \${
            theme === 'light' 
              ? 'bg-[#991b1b]/10 hover:bg-[#991b1b]/20 border-[#991b1b]/60 text-[#991b1b]' 
              : 'bg-[#fca5a5]/10 hover:bg-[#fca5a5]/20 border-[#fca5a5]/50 text-[#fca5a5]'
          }\`}
          title="Clear all emphasis weights from text"
        >
          {t('clear_all_weights', lang)}
        </button>`;

code = code.replace(regexMerge, newMerge);

const regexEmphasizeButtons = /<div className="flex items-center space-x-1">\s*<button \s*onClick=\{handleEmphasizeAdd\}[\s\S]*?\( \) Clear<\/button>\s*<\/div>/m;

const newEmphasizeButtons = `<div className="flex items-center space-x-1">
          <button 
            onClick={handleEmphasizeAdd}
            className="px-2 py-1 bg-bg-surface hover:bg-amber-500/10 text-[10px] font-mono border border-amber-500/40 rounded text-amber-500 transition-colors"
            title="Add Emphasis ()"
          >+( )</button>
          <button 
            onClick={handleEmphasizeRemove}
            className="px-2 py-1 bg-bg-surface hover:bg-amber-500/10 text-[10px] font-mono border border-amber-500/40 rounded text-amber-500 transition-colors"
            title="Remove 1 Layer of Emphasis"
          >-( )</button>
          <button 
            onClick={handleEmphasizeClear}
            className="px-2 py-1 bg-bg-surface hover:bg-amber-500/10 text-[10px] font-mono border border-amber-500/40 rounded text-amber-500 transition-colors"
            title="Clear All Emphasis"
          >( ) Clear</button>
        </div>`;

code = code.replace(regexEmphasizeButtons, newEmphasizeButtons);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
