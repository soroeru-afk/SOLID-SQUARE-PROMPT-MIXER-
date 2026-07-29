const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Add isPositiveOpen state
code = code.replace("const [isNegativeOpen, setIsNegativeOpen] = useState(true);", "const [isNegativeOpen, setIsNegativeOpen] = useState(true);\n  const [isPositiveOpen, setIsPositiveOpen] = useState(true);");

// 2. Adjust Tabs margins and padding
code = code.replace(/<div className="flex-1 p-4 overflow-y-auto bg-bg-panel flex flex-col gap-4">/, '<div className="flex-1 p-4 pt-2 overflow-y-auto bg-bg-panel flex flex-col gap-2">');
code = code.replace(/<div className="flex items-center overflow-x-auto px-0 pt-0 pb-2 bg-transparent pb-0 shrink-0/g, '<div className="flex items-center overflow-x-auto px-0 pt-0 pb-1 bg-transparent shrink-0');
code = code.replace(/className=\{`group flex items-center gap-1\.5 px-3 py-1\.5 text-\[10px\]/g, 'className={`group flex items-center gap-1.5 px-3 py-1 text-[10px]');
code = code.replace(/className=\{`ml-auto px-3 py-1\.5 text-\[9px\]/g, 'className={`ml-auto px-3 py-1 text-[9px]');

// 3. Fix colors of PROMPT and NEGATIVE PROMPT (text-text-main instead of text-text-dim/50 or text-gray-400)
// For PROMPT, convert to toggle button
const promptTitleRegex = /<span className=\{`text-\[9px\] font-mono font-bold uppercase mt-1 \$\{paperMode \? 'text-gray-400' : 'text-text-dim\/50'\}`\}>PROMPT<\/span>/;
const newPromptBtn = `<button 
              onClick={() => setIsPositiveOpen(!isPositiveOpen)}
              className={\`flex items-center gap-1 text-[10px] font-mono font-bold uppercase mt-1 transition-colors \${paperMode ? 'text-black' : 'text-text-main'} hover:opacity-70\`}
            >
              {isPositiveOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              PROMPT
            </button>`;

if (code.match(promptTitleRegex)) {
  code = code.replace(promptTitleRegex, newPromptBtn);
} else {
  console.log("PROMPT title not found");
}

// For NEGATIVE PROMPT, update text color
const negTitleRegex = /<button \n\s*onClick=\{\(\) => setIsNegativeOpen\(!isNegativeOpen\)\}\n\s*className=\{`flex items-center gap-1 text-\[9px\] font-mono font-bold uppercase mt-1 transition-colors \$\{paperMode \? 'text-gray-400 hover:text-gray-600' : 'text-text-dim\/50 hover:text-text-main'\}`\}\n\s*>\n\s*\{isNegativeOpen \? <ChevronDown className="w-3 h-3" \/> : <ChevronRight className="w-3 h-3" \/>\}\n\s*NEGATIVE PROMPT\n\s*<\/button>/;

const newNegTitle = `<button 
            onClick={() => setIsNegativeOpen(!isNegativeOpen)}
            className={\`flex items-center gap-1 text-[10px] font-mono font-bold uppercase mt-1 transition-colors \${paperMode ? 'text-black' : 'text-text-main'} hover:opacity-70\`}
          >
            {isNegativeOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            NEGATIVE PROMPT
          </button>`;

if (code.match(negTitleRegex)) {
  code = code.replace(negTitleRegex, newNegTitle);
} else {
  console.log("NEGATIVE PROMPT title not found");
}

// 4. Update the Positive Prompt Container to be conditionally rendered inside, or change flex-1
const posContainerRegex = /<div className=\{`flex-1 border border-border-main rounded-lg flex flex-col relative min-h-\[100px\] transition-colors \$\{paperMode \? 'bg-\[\#f4f4f5\] border-gray-300 shadow-inner' : 'bg-bg-base'\}`\}>/;

if (code.match(posContainerRegex)) {
  code = code.replace(posContainerRegex, `<div className={\`\${isPositiveOpen ? 'flex-1 min-h-[100px]' : 'shrink-0'} border border-border-main rounded-lg flex flex-col relative transition-colors \${paperMode ? 'bg-[#f4f4f5] border-gray-300 shadow-inner' : 'bg-bg-base'}\`}>`);
}

// 5. Hide the content of the positive prompt if closed
// Find the content div
const posContentRegex = /<div className="flex-1 relative flex flex-col mt-1">/;
if (code.match(posContentRegex)) {
  code = code.replace(posContentRegex, `{isPositiveOpen && (\n          <div className="flex-1 relative flex flex-col mt-1">`);
  
  // Close the bracket at the end of positive block
  // It is before: {/* Move/Copy Text Buttons & Resizer */}
  const posContentEndRegex = /<\/textarea>\n\s*<\/div>\n\s*<\/div>\n\s*\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}/;
  if (code.match(posContentEndRegex)) {
    code = code.replace(posContentEndRegex, `</textarea>\n            </div>\n          )}\n        </div>\n\n        {/* Move/Copy Text Buttons & Resizer */}`);
  } else {
    console.log("posContentEndRegex not found");
  }
} else {
  console.log("posContentRegex not found");
}

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patch applied");
