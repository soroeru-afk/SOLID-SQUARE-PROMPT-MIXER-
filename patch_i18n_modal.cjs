const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(/save_as_memo: \{ en: 'SAVE AS MEMO', ja: 'メモ保存' \},/, "save_as_memo: { en: 'SAVE AS MEMO', ja: 'メモ保存' },\n  save_as_new: { en: 'SAVE AS NEW', ja: '新規保存' },\n  update_current: { en: 'UPDATE CURRENT', ja: '上書き保存' },");

fs.writeFileSync('src/i18n.ts', code);
