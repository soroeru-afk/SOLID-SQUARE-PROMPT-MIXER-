const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

code = code.replace(/\{t\('add_master', lang\)\}/g, "{t('add_memo', lang)}");

fs.writeFileSync('src/components/MemoColumn.tsx', code);
