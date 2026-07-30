const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

const oldClass = "className={`block p-3 rounded-lg group cursor-pointer transition-colors relative bg-transparent border border-border-main hover:border-border-hover`}";
const newClass = "className={`block p-3 rounded-lg group cursor-pointer transition-colors relative ${isSelected ? (isNegative ? 'bg-red-500/10 border border-red-500/50' : 'bg-bg-input border border-blue-500/50') : (isNegative ? 'bg-red-500/5 border border-red-500/30 hover:border-red-500/50' : 'bg-transparent border border-border-main hover:border-border-hover')}`}";

code = code.replace(oldClass, newClass);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn for negative backgrounds");
