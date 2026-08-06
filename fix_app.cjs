const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const exportBtnRegex = /<button onClick=\{handleExport\} className="flex-1 flex items-center justify-center px-2 py-1\.5 bg-accent-main hover:opacity-80 text-\[10px\] font-mono border border-accent-dim rounded text-white transition-opacity cursor-pointer">/;
const newExportBtn = `<button onClick={handleExport} className={\`flex-1 flex items-center justify-center px-2 py-1.5 text-[10px] font-mono border rounded text-white transition-opacity cursor-pointer \${theme === 'mono' ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-accent-main border-accent-dim hover:opacity-80'}\`}>`;

content = content.replace(exportBtnRegex, newExportBtn);
fs.writeFileSync('src/App.tsx', content);
console.log('Fixed export button');
