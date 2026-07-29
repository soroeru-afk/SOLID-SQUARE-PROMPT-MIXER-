const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Fix the width of a single tab
const xButtonRegex = /\{tabs\.length > 1 && \(\s*<button \s*onClick=\{\(e\) => \{ \s*e\.stopPropagation\(\); \s*if \(confirmCloseTabId === tab\.id\) \{\s*if \(onTabClose\) onTabClose\(tab\.id\);\s*setConfirmCloseTabId\(null\);\s*\} else \{\s*setConfirmCloseTabId\(tab\.id\);\s*setTimeout\(\(\) => setConfirmCloseTabId\(null\), 3000\);\s*\}\s*\}\}\s*className=\{`ml-1 w-4 h-4 flex items-center justify-center rounded-sm transition-colors \$\{\s*confirmCloseTabId === tab\.id \s*\? 'opacity-100 bg-red-500 text-white hover:bg-red-600' \s*: \(activeTabId === tab\.id \s*\? 'opacity-100 hover:bg-black\/5 dark:hover:bg-white\/10 hover:text-red-400' \s*: 'opacity-0 group-hover:opacity-100 hover:bg-black\/5 dark:hover:bg-white\/10 hover:text-red-400'\)\s*\}`\}\s*>\s*<X className="w-3 h-3" \/>\s*<\/button>\s*\)\}/;

const fixedXButton = `{tabs.length > 1 ? (
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (confirmCloseTabId === tab.id) {
                      if (onTabClose) onTabClose(tab.id);
                      setConfirmCloseTabId(null);
                    } else {
                      setConfirmCloseTabId(tab.id);
                      setTimeout(() => setConfirmCloseTabId(null), 3000);
                    }
                  }}
                  className={\`ml-1 w-4 h-4 flex items-center justify-center rounded-sm transition-colors \${
                    confirmCloseTabId === tab.id 
                      ? 'opacity-100 bg-red-500 text-white hover:bg-red-600' 
                      : (activeTabId === tab.id 
                          ? 'opacity-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-red-400' 
                          : 'opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-red-400')
                  }\`}
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <div className="ml-1 w-4 h-4 flex items-center justify-center opacity-0 pointer-events-none shrink-0">
                  <X className="w-3 h-3" />
                </div>
              )}`;

code = code.replace(xButtonRegex, fixedXButton);

// 2. Add dashed border to ALL CLEAR
const allClearBtnRegex = /<button \s*onClick=\{\(\) => \{\s*if \(confirmClearTabs\) \{\s*if \(onTabsClear\) onTabsClear\(\);\s*setConfirmClearTabs\(false\);\s*\} else \{\s*setConfirmClearTabs\(true\);\s*setTimeout\(\(\) => setConfirmClearTabs\(false\), 3000\);\s*\}\s*\}\} \s*className=\{`ml-auto px-3 py-1\.5 text-\[9px\] font-mono font-bold border rounded-sm transition-colors uppercase shrink-0 \$\{\s*confirmClearTabs \s*\? 'bg-red-500 text-white border-red-500 hover:bg-red-600' \s*: 'text-red-500 hover:text-white bg-transparent hover:bg-red-500\/80 border-transparent'\s*\}`\}\s*title="Clear all tabs"\s*>\s*\{confirmClearTabs \? t\('confirm_clear', lang\) \|\| 'SURE\?' : 'ALL CLEAR'\}\s*<\/button>/;

const allClearBtnFixed = `<button 
            onClick={() => {
              if (confirmClearTabs) {
                if (onTabsClear) onTabsClear();
                setConfirmClearTabs(false);
              } else {
                setConfirmClearTabs(true);
                setTimeout(() => setConfirmClearTabs(false), 3000);
              }
            }} 
            className={\`ml-auto px-3 py-1.5 text-[9px] font-mono font-bold border rounded-sm transition-colors uppercase shrink-0 \${
              confirmClearTabs 
                ? 'bg-red-500 text-white border-solid border-red-500 hover:bg-red-600' 
                : 'text-red-500 hover:text-white bg-transparent hover:bg-red-500/80 border-dashed border-red-500/50 hover:border-red-500/80'
            }\`}
            title="Clear all tabs"
          >
            {confirmClearTabs ? t('confirm_clear', lang) || 'SURE?' : 'ALL CLEAR'}
          </button>`;

code = code.replace(allClearBtnRegex, allClearBtnFixed);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
