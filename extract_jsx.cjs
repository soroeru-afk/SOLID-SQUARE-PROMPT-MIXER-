const fs = require('fs'); 
const srcCode = fs.readFileSync('C:/Users/soroe/Documents/A-App/data/■-solid-square-prompt-mixer/src/App.tsx', 'utf8'); 
const start = srcCode.indexOf('<div className="mt-4 border-t'); 
const end = srcCode.indexOf('</div>', srcCode.indexOf('handleExportParts')) + 6; 
console.log(srcCode.substring(start, end));
