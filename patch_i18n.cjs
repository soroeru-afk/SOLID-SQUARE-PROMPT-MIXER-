const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(/variation_parts: \{ en: 'PARTS', ja: 'パーツ選択' \},/, "variation_parts: { en: 'PARTS', ja: 'パーツ選択' },\n  prompt_memo: { en: 'MEMO', ja: 'プロンプトメモ' },");
code = code.replace(/save_master_hint: \{ en: 'Save your customized prompt', ja: '現在のテキストを保存' \},/, "save_master_hint: { en: 'Save your customized prompt', ja: '現在のテキストを保存' },\n  add_memo: { en: 'ADD MEMO', ja: 'メモを追加' },\n  new_memo_title: { en: 'Memo Title...', ja: 'メモのタイトル...' },\n  new_memo_content: { en: 'Memo content...', ja: 'メモの内容...' },");

fs.writeFileSync('src/i18n.ts', code);
