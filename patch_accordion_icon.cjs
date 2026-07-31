const fs = require('fs');
let code = fs.readFileSync('src/components/Accordion.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => setIsOpen\(!isOpen\)\}\s*className=\{`w-3 h-3 border border-border-hover rounded-sm flex items-center justify-center transition-transform duration-300 cursor-pointer \$\{isOpen \? 'rotate-180 bg-bg-surface' : ''\}`\}/,
  "className={`w-3 h-3 border border-border-hover rounded-sm flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-bg-surface' : ''}`}"
);

fs.writeFileSync('src/components/Accordion.tsx', code);
console.log("Patched Accordion icon");
