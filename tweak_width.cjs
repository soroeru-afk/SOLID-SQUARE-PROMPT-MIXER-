const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(/w-\[120px\]/g, 'w-[140px]');

fs.writeFileSync('src/components/VariationColumn.tsx', code);
