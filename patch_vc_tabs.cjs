const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// Add activeTab, setActiveTab and children props
const propsRegex = /lang: Language;\n  theme: string;\n\}/;
code = code.replace(propsRegex, "lang: Language;\n  theme: string;\n  activeTab?: 'parts' | 'memo';\n  setActiveTab?: (tab: 'parts' | 'memo') => void;\n  children?: React.ReactNode;\n}");

const destructureRegex = /onCopyBulkToMaster, lang, theme\n\}\) => \{/;
code = code.replace(destructureRegex, "onCopyBulkToMaster, lang, theme, activeTab = 'parts', setActiveTab, children\n}) => {");

// Replace header
const headerRegex = /<div className="flex bg-bg-panel border-b border-border-main text-\[9px\] font-mono uppercase tracking-widest shrink-0 overflow-x-auto justify-between items-center pr-2">\s*<div className="px-4 py-3 border-r border-border-main bg-bg-surface text-text-main border-b-2 border-b-blue-500 whitespace-nowrap">\{t\('variation_parts', lang\)\}<\/div>\s*<div className="flex gap-2">/m;

const newHeader = `<div className="flex bg-bg-panel border-b border-border-main text-[10px] font-mono uppercase tracking-widest shrink-0 overflow-x-auto justify-between items-center pr-2 h-[41px]">
        <div className="flex items-center h-full">
          <button 
            onClick={() => setActiveTab?.('parts')}
            className={\`px-4 py-3 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'parts' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
          >
            {t('variation_parts', lang)}
          </button>
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('memo')}
              className={\`px-4 py-3 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'memo' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
            >
              {t('prompt_memo', lang)}
            </button>
          )}
        </div>
        {activeTab === 'parts' && (
          <div className="flex gap-2">`;
code = code.replace(headerRegex, newHeader);

// Close the activeTab condition around the expand/collapse buttons
const buttonsRegex = /<\/button>\s*<\/div>\s*<\/div>/;
code = code.replace(buttonsRegex, "</button>\n          </div>\n        )}\n      </div>");

// Wrap the variation parts content in an activeTab condition
const contentRegex = /<div className="p-4 flex-1 flex flex-col space-y-4 overflow-hidden min-h-0">/;
code = code.replace(contentRegex, "{activeTab === 'parts' ? (\n      <div className=\"p-4 flex-1 flex flex-col space-y-4 overflow-hidden min-h-0\">");

const endRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/>/;
// We need to carefully find the end of the return statement
code = code.replace(/<\/div>\n      <\/div>\n    <\/>/, "</div>\n      </div>\n      ) : (\n        children\n      )}\n    </>");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
