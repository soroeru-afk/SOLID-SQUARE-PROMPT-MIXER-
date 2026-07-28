const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');
console.log(code.substring(0, 1000));
