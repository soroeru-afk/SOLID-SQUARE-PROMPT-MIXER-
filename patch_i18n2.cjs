const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(/clear_all_weights: \{ en: 'CLEAR WEIGHTS', ja: '正規化\(クリア\)' \},/, 
`clear_all_weights: { en: 'CLEAR WEIGHTS', ja: '正規化(プレーン)' },
  emphasize_clear: { en: '( ) Clear', ja: '( ) 消去' },`);

fs.writeFileSync('src/i18n.ts', code);
