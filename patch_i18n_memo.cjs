const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(/variation_parts: \{ en: 'VARIATION_PARTS', ja: 'パーツ選択' \},/, "variation_parts: { en: 'VARIATION_PARTS', ja: 'パーツ選択' },\n  prompt_memo: { en: 'MEMO', ja: 'プロンプトメモ' },");
code = code.replace(/save_master_hint: \{ en: '\(Prefix "▼ Title" for multiple\)', ja: '（▼タイトル で複数分割保存）' \},/, "save_master_hint: { en: '(Prefix \"▼ Title\" for multiple)', ja: '（▼タイトル で複数分割保存）' },\n  add_memo: { en: '+ ADD_NEW_MEMO', ja: '+ メモ追加' },\n  new_memo_title: { en: 'Memo Title...', ja: 'メモタイトル...' },\n  new_memo_content: { en: 'Memo content...', ja: 'メモ内容...' },");

fs.writeFileSync('src/i18n.ts', code);
