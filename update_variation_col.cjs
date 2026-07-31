const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(/activeTab\?: 'parts' \| 'memo';/g, "activeTab?: 'parts' | 'mixer' | 'memo';");
code = code.replace(/setActiveTab\?: \(tab: 'parts' \| 'memo'\) => void;/g, "setActiveTab?: (tab: 'parts' | 'mixer' | 'memo') => void;");
code = code.replace(/activeTab = 'parts',/, "activeTab = 'parts',");

// Now update the tab rendering block
const tabsRegex = /<div className="flex items-center h-full">([\s\S]*?)<\/div>\s*\{activeTab === 'parts' && \(/;

const newTabs = `<div className="flex items-center h-full">
          <button 
            onClick={() => setActiveTab?.('parts')}
            className={\`px-4 py-3 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'parts' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
          >
            {t('variation_parts', lang)}
          </button>
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('mixer')}
              className={\`px-4 py-3 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'mixer' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
            >
              属性設定ミキサー
            </button>
          )}
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('memo')}
              className={\`px-4 py-3 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'memo' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
            >
              {t('prompt_memo', lang)}
            </button>
          )}
        </div>
        
        {/* We move Expand All / Collapse All under the search bar later down */}`;

code = code.replace(tabsRegex, newTabs + "\n        {activeTab === 'parts' && (");

// Remove the inline attribute mixer
code = code.replace(/\{\/\* Attribute Mixer \*\/\}\s*<div className="shrink-0 flex pt-2 pb-1 w-full">\s*<AttributeMixer onApply=\{onMixAttributes \|\| \(\(\) => \{\}\)\} theme=\{theme\} \/>\s*<\/div>/, '');

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log('Tabs updated in VariationColumn.tsx');
