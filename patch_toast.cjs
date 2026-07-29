const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove original toast
const toastRegex = /\{\s*saveSuccessMessage && \(\s*<div className="fixed bottom-10 right-10[^>]+>\s*<Check className="w-4 h-4" \/>\s*<span>\{saveSuccessMessage\}<\/span>\s*<\/div>\s*\)\s*\}/;
code = code.replace(toastRegex, '');

// Add it to the 08 DRIVE 保存先 area
const driveSectionRegex = /(<button \n\s*onClick=\{handleChangeExportDir\}\n\s*className="w-full text-center px-2 py-1\.5 bg-bg-panel hover:bg-border-main border border-border-main rounded text-\[10px\] font-mono text-text-main truncate transition-colors"\n\s*>\n\s*\{exportDirectoryName \|\| '未設定 \(設定するにはクリック\)'\}\n\s*<\/button>)/;

const newDriveSection = `$1\n              {saveSuccessMessage && (\n                <div className="mt-2 text-center text-[9px] font-mono text-accent-main animate-pulse">\n                  {saveSuccessMessage}\n                </div>\n              )}`;

code = code.replace(driveSectionRegex, newDriveSection);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched toast");
