const fs = require('fs');

let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const oldTabs = `<div className="flex bg-bg-panel border-b border-border-main text-[10px] font-mono uppercase tracking-widest shrink-0 overflow-x-auto justify-between items-center pr-2 h-[41px]">
        <div className="flex items-center h-full">
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
        
      </div>`;

const newTabs = `<div className="flex bg-bg-panel border-b border-border-main text-[10px] font-mono uppercase tracking-widest shrink-0 overflow-x-auto h-[41px]">
        <div className="flex items-center h-full w-full">
          <button 
            onClick={() => setActiveTab?.('parts')}
            className={\`flex-1 flex justify-center items-center gap-1 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'parts' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
          >
            {t('variation_parts', lang)}
          </button>
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('mixer')}
              className={\`flex-1 flex justify-center items-center gap-1 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'mixer' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
            >
              <User size={12} /> 属性設定ミキサー
            </button>
          )}
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('memo')}
              className={\`flex-1 flex justify-center items-center gap-1 border-r border-border-main whitespace-nowrap h-full transition-colors \${activeTab === 'memo' ? 'bg-bg-surface text-text-main border-b-2 border-b-blue-500' : 'text-text-dim hover:bg-bg-input'}\`}
            >
              {t('prompt_memo', lang)}
            </button>
          )}
        </div>
      </div>`;

code = code.replace(oldTabs, newTabs);

const oldSearchExpand = `<div className="flex flex-col gap-2 shrink-0">
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

const newSearchExpand = `<div className="flex flex-col gap-2 shrink-0">
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
          <div className="flex justify-start">
            <button 
              onClick={() => {
                if (isAllExpanded) {
                  setCollapseId(prev => prev + 1);
                } else {
                  setExpandId(prev => prev + 1);
                }
                setIsAllExpanded(!isAllExpanded);
              }} 
              className={\`px-3 py-1 border rounded transition-colors whitespace-nowrap flex items-center justify-center gap-1 shrink-0 w-[140px] \${
                (theme === 'light' || theme === 'mono') || theme === 'paper'
                  ? 'bg-gray-200 hover:bg-gray-300 text-black border-gray-400 font-bold'
                  : 'bg-transparent hover:bg-white/10 text-white border-white/50 font-bold'
              }\`}
            >
              {isAllExpanded ? <ChevronsUp size={12} /> : <ChevronsDown size={12} />}
              {isAllExpanded ? t('collapse_all', lang) : t('expand_all', lang)}
            </button>
          </div>
        </div>`;

code = code.replace(oldSearchExpand, newSearchExpand);

if (!code.includes("import { User")) {
    code = code.replace("import { Pencil,", "import { User, Pencil,");
}

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Updated Tabs and Expand Button");
