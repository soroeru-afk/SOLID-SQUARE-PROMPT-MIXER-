const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const oldBtn = /<button \s*onClick=\{handleApply\}[\s\S]*?<\/button>/;
const newBtns = `<div className="flex gap-2 mt-4">
            <button 
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1 rounded py-2.5 text-[13px] font-bold font-mono transition-colors border border-border-main hover:bg-bg-input text-text-main"
            >
              ↩️ リセット
            </button>
            <button 
              onClick={handleApply}
              className={\`flex-[2] flex items-center justify-center gap-1 rounded py-2.5 text-[13px] font-bold font-mono transition-colors \${btnClass}\`}
            >
              <Check className="w-4 h-4" /> 適用 (上書き/挿入)
            </button>
          </div>`;

code = code.replace(oldBtn, newBtns);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
console.log("Updated buttons");
