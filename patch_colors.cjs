const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexColors = /\? 'bg-\\[#b45309\\]\/5 hover:bg-\\[#b45309\\]\/10 border-\\[#b45309\\]\/40 text-\\[#b45309\\]'/g;
code = code.replace(regexColors, "? 'bg-[#7c2d12]/10 hover:bg-[#7c2d12]/20 border-[#7c2d12]/60 text-[#7c2d12] font-bold'");

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
