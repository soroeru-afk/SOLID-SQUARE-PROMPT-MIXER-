const fs = require('fs');

let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const expandBtnCode = `
        {activeTab === 'parts' && (
          <div className="flex gap-2">
          <button 
            onClick={() => {
              if (isAllExpanded) {
                setCollapseId(prev => prev + 1);
              } else {
                setExpandId(prev => prev + 1);
              }
              setIsAllExpanded(!isAllExpanded);
            }} 
            className={\`px-3 py-1 border rounded transition-colors whitespace-nowrap flex items-center justify-center gap-1 w-[140px] shrink-0 \${
              (theme === 'light' || theme === 'mono') || theme === 'paper'
                ? 'bg-gray-200 hover:bg-gray-300 text-black border-gray-400 font-bold'
                : 'bg-transparent hover:bg-white/10 text-white border-white/50 font-bold'
            }\`}
          >
            {isAllExpanded ? <ChevronsUp size={12} /> : <ChevronsDown size={12} />}
            {isAllExpanded ? t('collapse_all', lang) : t('expand_all', lang)}
          </button>
          </div>
        )}
`;

code = code.replace(expandBtnCode, "");
code = code.replace("{/* We move Expand All / Collapse All under the search bar later down */}", "");

// And remove an extra leftover if it exists
code = code.replace(/\n\s*\{\/\* We move Expand All \/ Collapse All under the search bar later down \*\/\}\n\s*\{activeTab === 'parts' && \(\n\s*<div className="flex gap-2">\n[\s\S]*?<\/div>\n\s*\)\}/, '');


// Now insert the expand/collapse button under the search box
const searchBoxEnd = `        <div className="flex space-x-2 shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('search', lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-input border border-border-main text-[11px] font-mono px-8 py-2 rounded focus:outline-none focus:border-blue-500 text-text-main placeholder-gray-600"
            />
            <span className="absolute left-2.5 top-2.5 opacity-30 font-mono text-[10px] text-text-main">/</span>
          </div>
        </div>`;

const newSearchPlusExpand = `        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('search', lang)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-input border border-border-main text-[11px] font-mono px-8 py-2 rounded focus:outline-none focus:border-blue-500 text-text-main placeholder-gray-600"
              />
              <span className="absolute left-2.5 top-2.5 opacity-30 font-mono text-[10px] text-text-main">/</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (isAllExpanded) {
                setCollapseId(prev => prev + 1);
              } else {
                setExpandId(prev => prev + 1);
              }
              setIsAllExpanded(!isAllExpanded);
            }} 
            className={\`px-3 py-1.5 border rounded transition-colors whitespace-nowrap flex items-center justify-center gap-1 w-full shrink-0 \${
              (theme === 'light' || theme === 'mono') || theme === 'paper'
                ? 'bg-gray-200 hover:bg-gray-300 text-black border-gray-400 font-bold'
                : 'bg-transparent hover:bg-white/10 text-white border-white/50 font-bold'
            }\`}
          >
            {isAllExpanded ? <ChevronsUp size={12} /> : <ChevronsDown size={12} />}
            {isAllExpanded ? t('collapse_all', lang) : t('expand_all', lang)}
          </button>
        </div>`;

code = code.replace(searchBoxEnd, newSearchPlusExpand);

// Now handle the activeTab === 'mixer'
// Let's add it right after activeTab === 'parts' render block.
// The parts render block ends around line 542: `      ) : (\n        <div className="p-4 flex-1 overflow-y-auto">...`
// Wait, there's `activeTab === 'parts' ? ( ... ) : ( ... )` which is the memo block.
// Let's modify this to be a multi-branch.
const tabsRenderRegex = /\{activeTab === 'parts' \? \([\s\S]*?\)\s*\}\s*<\/>\s*\);\s*\};/g;

// Instead of regex, let's just find the `activeTab === 'parts' ? (`
