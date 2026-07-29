const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(/save_as_master: \{ en: 'SAVE AS MASTER', ja: 'マスター保存' \},/,
"save_as_master: { en: 'SAVE AS MASTER', ja: 'マスター保存' },\n  save_as_set: { en: 'SAVE SET', ja: 'セット保存' },");

fs.writeFileSync('src/i18n.ts', code);
