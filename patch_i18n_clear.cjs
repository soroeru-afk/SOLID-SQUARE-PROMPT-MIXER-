const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(/clear_all: \{ en: 'CLEAR ALL', ja: 'すべて消去' \},/, "clear_all: { en: 'CLEAR ALL', ja: 'すべて消去' },\n  clear: { en: 'CLEAR', ja: '消去' },");

fs.writeFileSync('src/i18n.ts', code);
