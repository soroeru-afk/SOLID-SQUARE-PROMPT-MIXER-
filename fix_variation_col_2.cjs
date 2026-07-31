const fs = require('fs');

let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const searchBox = `        <div className="flex space-x-2 shrink-0">
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

const newSearchBoxAndExpand = `        <div className="flex flex-col gap-2 shrink-0">
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

code = code.replace(searchBox, newSearchBoxAndExpand);
fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Added Expand All / Collapse All under search bar");
