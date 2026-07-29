const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Add state for isNegativeOpen
if (!code.includes("const [isNegativeOpen, setIsNegativeOpen]")) {
  code = code.replace("const [negativeHeight, setNegativeHeight] = useState(120);", "const [negativeHeight, setNegativeHeight] = useState(120);\n  const [isNegativeOpen, setIsNegativeOpen] = useState(true);");
}

// 2. Hide resizer if not open
const resizerRegex = /\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}[\s\S]*?<div className="flex justify-center -my-3 relative z-10">/;
if (code.match(resizerRegex)) {
  code = code.replace(resizerRegex, `{/* Move/Copy Text Buttons & Resizer */}\n        {isNegativeOpen && (\n        <div className="flex justify-center -my-3 relative z-10">`);
  
  // Close the bracket for the resizer container
  const resizerEndRegex = /<\/div>\n\s*<\/div>\n\s*<div \n\s*className=\{`border border-border-main/;
  if (code.match(resizerEndRegex)) {
    code = code.replace(resizerEndRegex, `</div>\n        </div>\n        )}\n\n        <div \n          className={\`border border-border-main`);
  }
}

// 3. Make negative container height auto if closed
const negContainerRegex = /<div \n\s*className=\{`border border-border-main rounded-lg flex flex-col shrink-0 relative transition-colors \$\{paperMode \? 'bg-\[\#f4f4f5\] border-gray-300 shadow-inner' : 'bg-bg-base'\}`\}\n\s*style=\{\{ height: `\$\{negativeHeight\}px` \}\}\n\s*>/;
if (code.match(negContainerRegex)) {
  code = code.replace(negContainerRegex, `<div \n          className={\`border border-border-main rounded-lg flex flex-col shrink-0 relative transition-colors \${paperMode ? 'bg-[#f4f4f5] border-gray-300 shadow-inner' : 'bg-bg-base'}\`}\n          style={{ height: isNegativeOpen ? \`\${negativeHeight}px\` : 'auto' }}\n        >`);
}

// 4. Make negative title a toggle button
const negHeaderRegex = /<span className=\{`text-\[9px\] font-mono font-bold uppercase mt-1 \$\{paperMode \? 'text-gray-400' : 'text-text-dim\/50'\}`\}>NEGATIVE PROMPT<\/span>/;
if (code.match(negHeaderRegex)) {
  code = code.replace(negHeaderRegex, `<button \n            onClick={() => setIsNegativeOpen(!isNegativeOpen)}\n            className={\`flex items-center gap-1 text-[9px] font-mono font-bold uppercase mt-1 transition-colors \${paperMode ? 'text-gray-400 hover:text-gray-600' : 'text-text-dim/50 hover:text-text-main'}\`}\n          >\n            {isNegativeOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}\n            NEGATIVE PROMPT\n          </button>`);
}

// 5. Hide negative content if closed
const negContentRegex = /<div className="flex-1 relative flex flex-col mt-1">/;
if (code.match(negContentRegex)) {
  code = code.replace(negContentRegex, `{isNegativeOpen && (\n          <div className="flex-1 relative flex flex-col mt-1">`);
  
  // Close it before Modals
  const modEndRegex = /<\/textarea>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\{\/\* Toast Notification \*\/\}/;
  if (code.match(modEndRegex)) {
    code = code.replace(modEndRegex, `</textarea>\n            </div>\n          )}\n        </div>\n      </div>\n\n      {/* Toast Notification */}`);
  }
}

// 6. Fix ChevronDown import
if (!code.includes("ChevronDown")) {
  code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, ChevronDown } from 'lucide-react';");
}

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Phase 3 done");
