const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace("mem: { en: 'MEM', ja: 'メモリ' }", "mem: { en: 'MEM', ja: 'メモリ' },\n  confirm_clear: { en: 'SURE?', ja: '本当によろしいですか？' }");

fs.writeFileSync('src/i18n.ts', code);
