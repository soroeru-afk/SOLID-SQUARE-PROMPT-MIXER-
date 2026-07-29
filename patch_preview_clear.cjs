const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Add confirmClearTabs state
code = code.replace("const [isSaveMemoModalOpen, setIsSaveMemoModalOpen] = useState(false);", "const [confirmClearTabs, setConfirmClearTabs] = useState(false);\n  const [isSaveMemoModalOpen, setIsSaveMemoModalOpen] = useState(false);");

// 2. Add scrollbar-hide to tabs container
const containerRegex = /<div className="flex items-center overflow-x-auto px-2 py-1\.5 bg-bg-panel border-b border-border-main shrink-0" style=\{\{ gap: '4px' \}\}>/;
const newContainer = `<div className="flex items-center overflow-x-auto px-2 py-1.5 bg-bg-panel border-b border-border-main shrink-0 [&::-webkit-scrollbar]:hidden" style={{ gap: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>`;
code = code.replace(containerRegex, newContainer);

// 3. Update ALL CLEAR button
const buttonRegex = /<button \n\s*onClick=\{onTabsClear\} \n\s*className="ml-auto px-3 py-1\.5 text-\[9px\] font-mono font-bold text-red-500 hover:text-white bg-transparent hover:bg-red-500\/80 border border-transparent rounded-sm transition-colors uppercase shrink-0"\n\s*title="Clear all tabs"\n\s*>\n\s*ALL CLEAR\n\s*<\/button>/;

const newButton = `<button 
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
                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                : 'text-red-500 hover:text-white bg-transparent hover:bg-red-500/80 border-transparent'
            }\`}
            title="Clear all tabs"
          >
            {confirmClearTabs ? t('confirm_clear', lang) || 'SURE?' : 'ALL CLEAR'}
          </button>`;

code = code.replace(buttonRegex, newButton);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
