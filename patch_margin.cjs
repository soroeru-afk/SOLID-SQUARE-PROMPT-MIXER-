const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStr = `<div className="mt-2 text-center text-[9px] font-mono text-accent-main animate-pulse">`;
const newStr = `<div className="mt-1 text-center text-[10px] font-mono text-accent-main animate-pulse font-bold">`;
code = code.replace(oldStr, newStr);

fs.writeFileSync('src/App.tsx', code);
