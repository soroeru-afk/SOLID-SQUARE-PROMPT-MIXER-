const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(/text-black dark:text-white/g, 'text-text-main');
code = code.replace(/<span className="text-\[8px\] text-text-dim\/50 font-mono hidden sm:inline-block">\{t\('save_master_hint', lang\)\}<\/span>/g, '');

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched text-text-main and removed hints");
