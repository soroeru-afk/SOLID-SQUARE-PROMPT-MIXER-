const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/generateId\(\)/g, '`memo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`');

fs.writeFileSync('src/App.tsx', code);
