const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// Add theme to props
const propsRegex = /lang: Language;\n\}/;
code = code.replace(propsRegex, "lang: Language;\n  theme: string;\n}");

// Add theme to destructuring
const destructureRegex = /onCopyBulkToMaster, lang\s*\n\}\) => \{/;
code = code.replace(destructureRegex, "onCopyBulkToMaster, lang, theme\n}) => {");

// Update expand/collapse button
const btnRegex = /<button \s*onClick=\{\(\) => \{[\s\S]*?\}\}\s*className="px-3 py-1 bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded transition-colors whitespace-nowrap flex items-center gap-1"\s*>\s*\{isAllExpanded \? <ChevronsUp size=\{12\} \/> : <ChevronsDown size=\{12\} \/>\}\s*\{isAllExpanded \? t\('collapse_all', lang\) : t\('expand_all', lang\)\}\s*<\/button>/m;
const newBtn = `<button 
            onClick={() => {
              if (isAllExpanded) {
                setCollapseId(prev => prev + 1);
              } else {
                setExpandId(prev => prev + 1);
              }
              setIsAllExpanded(!isAllExpanded);
            }} 
            className={\`px-3 py-1 border rounded transition-colors whitespace-nowrap flex items-center justify-center gap-1 w-[120px] shrink-0 \${
              theme === 'light' || theme === 'paper'
                ? 'bg-gray-200 hover:bg-gray-300 text-black border-gray-400 font-bold'
                : 'bg-transparent hover:bg-white/10 text-white border-white/50 font-bold'
            }\`}
          >
            {isAllExpanded ? <ChevronsUp size={12} /> : <ChevronsDown size={12} />}
            {isAllExpanded ? t('collapse_all', lang) : t('expand_all', lang)}
          </button>`;
code = code.replace(btnRegex, newBtn);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
