const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// The resizer container:
const resizerRegex = /\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<div \s*className=\{`border border-border-main rounded-lg flex flex-col shrink-0 relative transition-colors \$\{paperMode \? 'bg-\[\#f4f4f5\] border-gray-300 shadow-inner' : 'bg-bg-base'\}`\}\s*style=\{\{ height: `\$\{negativeHeight\}px` \}\}\s*>/;

if (!code.match(resizerRegex)) {
  console.log("Regex not matched!");
} else {
  code = code.replace(resizerRegex, (match) => {
    // Add conditional logic around the resizer
    return `{isNegativeOpen && (\n        ${match.split('<div \n          className={`border')[0]}\n      )}\n      <div \n          className={\`border border-border-main rounded-lg flex flex-col shrink-0 relative transition-colors \${paperMode ? 'bg-[#f4f4f5] border-gray-300 shadow-inner' : 'bg-bg-base'}\`}\n          style={{ height: isNegativeOpen ? \`\${negativeHeight}px\` : 'auto' }}\n        >`;
  });
}

// Now we need to add the toggle button to the negative prompt header, and hide the content if !isNegativeOpen
const negativeHeaderRegex = /<span className=\{`text-\[9px\] font-mono font-bold uppercase mt-1 \$\{paperMode \? 'text-gray-400' : 'text-text-dim\/50'\}`\}>NEGATIVE PROMPT<\/span>/;

if (!code.match(negativeHeaderRegex)) {
  console.log("Negative Header Regex not matched!");
} else {
  code = code.replace(negativeHeaderRegex, (match) => {
    return `<button 
              onClick={() => setIsNegativeOpen(!isNegativeOpen)}
              className={\`flex items-center gap-1 text-[9px] font-mono font-bold uppercase mt-1 transition-colors \${paperMode ? 'text-gray-400 hover:text-gray-600' : 'text-text-dim/50 hover:text-text-main'}\`}
            >
              {isNegativeOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              NEGATIVE PROMPT
            </button>`;
  });
}

// We also need to import ChevronDown
if (!code.includes('ChevronDown')) {
  code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, ChevronDown } from 'lucide-react';");
}

// And hide the content of negative prompt
const negativeContentRegex = /<div className="flex-1 relative flex flex-col mt-1">/;
if (!code.match(negativeContentRegex)) {
  console.log("Negative Content Regex not matched!");
} else {
  code = code.replace(negativeContentRegex, `{isNegativeOpen && (\n          <div className="flex-1 relative flex flex-col mt-1">`);
  
  // We need to close it. The end of negative block is:
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     
  //     {/* Modals */}
  
  const endBlockRegex = /<\/textarea>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Modals \*\/\}/;
  if (!code.match(endBlockRegex)) {
    console.log("End Block Regex not matched!");
  } else {
    code = code.replace(endBlockRegex, `</textarea>\n            </div>\n          )} \n        </div>\n      </div>\n\n      {/* Modals */}`);
  }
}

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Phase 2 done");
