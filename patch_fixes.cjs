const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix filenames
code = code.replace(/全体バックアップ_\$\{dateStr\}\.json/g, 'PM-全体バックアップ_${dateStr}.json');
code = code.replace(/パーツ_\$\{dateStr\}\.json/g, 'PM-パーツ_${dateStr}.json');
code = code.replace(/a\.download = \`PM-全体バックアップ/g, 'a.download = `PM-全体バックアップ'); // Just in case it ran twice

// Fix button color
const oldBtn = "<button onClick={handleExportParts} className={`flex-1 flex items-center justify-center px-2 py-1.5 text-[10px] font-mono border rounded text-white transition-opacity cursor-pointer ${theme === 'mono' ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-accent-main border-accent-dim hover:opacity-80'}`}>\n                  {lang === 'en' ? 'Export (Parts)' : 'エクスポート (パーツ)'}\n                </button>";
const newBtn = "<button onClick={handleExportParts} className={`flex-1 flex items-center justify-center px-2 py-1.5 text-[10px] font-mono border rounded text-white transition-opacity cursor-pointer ${theme === 'mono' ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : (theme === 'black' ? 'bg-accent-main border-accent-dim hover:opacity-80' : 'bg-teal-600 border-teal-500 hover:opacity-80')}`}>\n                  {lang === 'en' ? 'Export (Parts)' : 'エクスポート (パーツ)'}\n                </button>";

if (code.includes(oldBtn)) {
  code = code.replace(oldBtn, newBtn);
  console.log("Button patched.");
} else {
  console.log("Button not found! Might be slightly different spacing.");
}

fs.writeFileSync('src/App.tsx', code);
console.log("Done.");
