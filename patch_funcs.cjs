const fs = require('fs');

const srcCode = fs.readFileSync('C:/Users/soroe/Documents/A-App/data/■-solid-square-prompt-mixer/src/App.tsx', 'utf8');

const startFunc = srcCode.indexOf('const handleExportOverall =');
const endFunc = srcCode.indexOf('};', srcCode.indexOf('handleImportParts')) + 2;
const newFuncs = srcCode.substring(startFunc, endFunc);

let myCode = fs.readFileSync('src/App.tsx', 'utf8');

// Replace functions
const oldFuncStart = myCode.indexOf('const handleExport =');
const oldFuncEnd = myCode.indexOf('};', myCode.indexOf('const handleImport =')) + 2;
myCode = myCode.substring(0, oldFuncStart) + newFuncs + myCode.substring(oldFuncEnd);

fs.writeFileSync('src/App.tsx', myCode);
console.log("Replaced functions successfully!");
