const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(/save_as_part: \{ en: 'SAVE AS PART', ja: 'パーツ保存' \},/, "save_as_part: { en: 'SAVE AS PART', ja: 'パーツ保存' },\n  save_as_memo: { en: 'SAVE AS MEMO', ja: 'メモ保存' },");

fs.writeFileSync('src/i18n.ts', code);
