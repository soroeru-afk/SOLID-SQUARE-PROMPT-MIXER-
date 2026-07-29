const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Add state for confirming tab close
code = code.replace("const [confirmClearTabs, setConfirmClearTabs] = useState(false);", "const [confirmClearTabs, setConfirmClearTabs] = useState(false);\n  const [confirmCloseTabId, setConfirmCloseTabId] = useState<string | null>(null);");

// 2. Extract tabs block
const tabsStartStr = "\\{tabs && tabs\\.length > 0 && onTabChange && \\([\\s\\S]*?<div className=\"flex items-center overflow-x-auto px-2 py-1\\.5 bg-bg-panel border-b border-border-main shrink-0 \\[&::-webkit-scrollbar\\]:hidden\" style=\\{\\{ gap: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' \\}\\}>[\\s\\S]*?ALL CLEAR[\\s\\S]*?<\\/button>\\s*<\\/div>\\s*\\)\\}";

const tabsRegex = new RegExp(tabsStartStr);
const match = code.match(tabsRegex);
if (!match) {
  console.log("Could not find tabs block");
  process.exit(1);
}
let tabsBlock = match[0];

// Remove tabs block from its current location
code = code.replace(tabsRegex, "");

// Modify tabs block to add the "one cushion" close
const xButtonRegex = /<button \n\s*onClick=\{\(e\) => \{ e\.stopPropagation\(\); if\(onTabClose\) onTabClose\(tab\.id\); \}\}\n\s*className=\{`ml-1 w-4 h-4 flex items-center justify-center rounded-sm transition-colors \$\{activeTabId === tab\.id \? 'opacity-100 hover:bg-black\/5 dark:hover:bg-white\/10 hover:text-red-400' : 'opacity-0 group-hover:opacity-100 hover:bg-black\/5 dark:hover:bg-white\/10 hover:text-red-400'\}`\}\n\s*>\n\s*<X className="w-3 h-3" \/>\n\s*<\/button>/;

const newXButton = `<button 
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
                </button>`;

tabsBlock = tabsBlock.replace(xButtonRegex, newXButton);

// 3. Insert tabs block after the toolbar
// We need to find the end of the toolbar
const toolbarEndRegex = /<Trash2 className="w-3 h-3" \/> \{t\('clear_all', lang\)\}\n\s*<\/button>\n\s*<\/div>/;

if (!code.match(toolbarEndRegex)) {
  console.log("Could not find toolbar end");
  process.exit(1);
}

code = code.replace(toolbarEndRegex, `$&
      
      {/* Tabs */}
      ${tabsBlock}`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Success");
