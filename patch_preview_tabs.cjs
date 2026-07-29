const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const targetStr = `return (
    <>
      <div className="p-3 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0">`;

const newStr = `return (
    <>
      {tabs && tabs.length > 0 && onTabChange && (
        <div className="flex items-center overflow-x-auto px-2 py-1.5 bg-bg-panel border-b border-border-main shrink-0" style={{ gap: '4px' }}>
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={\`group flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono border rounded-sm cursor-pointer whitespace-nowrap transition-all \${
                activeTabId === tab.id 
                  ? (theme === 'light' ? 'bg-white border-border-hover text-text-main font-bold shadow-sm' : 'bg-bg-input border-border-hover text-text-main font-bold') 
                  : 'bg-transparent border-transparent text-text-dim hover:bg-bg-input hover:text-text-main'
              }\`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.name}
              {tabs.length > 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); if(onTabClose) onTabClose(tab.id); }}
                  className={\`ml-1 w-4 h-4 flex items-center justify-center rounded-sm transition-colors \${activeTabId === tab.id ? 'opacity-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-red-400' : 'opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-red-400'}\`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={onTabAdd} 
            className="ml-1 px-2 py-1.5 text-text-dim hover:text-text-main hover:bg-bg-input rounded-sm border border-transparent transition-colors flex items-center justify-center shrink-0"
            title="Add Tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={onTabsClear} 
            className="ml-auto px-3 py-1.5 text-[9px] font-mono font-bold text-red-500 hover:text-white bg-transparent hover:bg-red-500/80 border border-transparent rounded-sm transition-colors uppercase shrink-0"
            title="Clear all tabs"
          >
            ALL CLEAR
          </button>
        </div>
      )}
      <div className="p-3 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0">`;

code = code.replace(targetStr, newStr);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
