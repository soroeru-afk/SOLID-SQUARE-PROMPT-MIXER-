const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexButton = /<button \n            onClick=\{handleMergeDupes\}[\s\S]*?\{t\('merge_dupes', lang\)\}\n          <\/button>/m;

const newButton = `<button 
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

code = code.replace(regexButton, newButton);

const regexEmphasisClearBtn = /<button \n            onClick=\{handleEmphasizeClear\}[\s\S]*?\{t\('clear_all_weights', lang\)\}\n          <\/button>/m; // wait, what was it called before?

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
