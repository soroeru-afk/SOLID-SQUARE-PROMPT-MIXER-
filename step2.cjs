const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const bottomButtonsTarget = /<div className="flex gap-2 pt-2 mt-2 border-t border-border-main">\s*<button\s*onClick=\{handleReset\}\s*className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded text-\[13px\] font-mono font-bold transition-colors"\s*>\s*\{lang === 'en' \? 'Reset' : 'リセット'\}\s*<\/button>\s*<button\s*onClick=\{handleApply\}\s*className=\{\`flex-1 px-3 py-2 \$\{theme === 'mono' \? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-500'\} text-white rounded text-\[13px\] font-mono font-bold transition-colors flex items-center justify-center gap-1\`\}\s*>\s*<Check className="w-4 h-4" \/> \{lang === 'en' \? 'Apply' : '適用する'\}\s*<\/button>\s*<\/div>/;

content = content.replace(bottomButtonsTarget, '');

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
