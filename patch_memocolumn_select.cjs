const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

code = code.replace(/currentOnSelect\(item\.id, false\);/g, "currentOnSelect(item.id, true);");

fs.writeFileSync('src/components/MemoColumn.tsx', code);
