const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// Replace handleApply
code = code.replace(
  /onApply\(pos, neg\);\n\s*setIsOpen\(false\);\n\s*\};/,
  'onApply(pos, neg);\n    // setIsOpen(false); removed to keep it open\n  };\n\n  const handleReset = () => {\n    setRace(\'\');\n    setAge(\'\');\n    setPhysique(\'\');\n    setAngle(\'\');\n    setPartnerOn(false);\n    onApply(\'\', \'\');\n  };'
);

// Replace the bottom button
const oldBtn = /<button[\s\S]*?onClick=\{handleApply\}[\s\S]*?適用.*?<\/button>/;
const newBtns = `<div className="flex gap-2 mt-4">
            <button 
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1 rounded py-2.5 text-[11px] font-bold font-mono transition-colors border border-border-main hover:bg-bg-input text-text-main"
            >
              ↩️ リセット
            </button>
            <button 
              onClick={handleApply}
              className={\`flex-[2] flex items-center justify-center gap-1 rounded py-2.5 text-[11px] font-bold font-mono transition-colors \${btnClass}\`}
            >
              <Check className="w-4 h-4" /> 適用 (上書き/挿入)
            </button>
          </div>`;

code = code.replace(oldBtn, newBtns);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
console.log("Updated AttributeMixer UI");
