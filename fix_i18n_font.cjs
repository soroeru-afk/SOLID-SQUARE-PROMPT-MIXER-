const fs = require('fs');
let content = fs.readFileSync('src/i18n.ts', 'utf8');
content = content.replace(
  /font_size: \{ en: 'FONT SIZE', ja: '文字サイズ' \},/,
  "font_size: { en: 'FONT SIZE', ja: '文字サイズ' },\n  font_weight: { en: 'FONT WEIGHT', ja: '文字の太さ' },\n  font_normal: { en: 'Normal', ja: 'ノーマル' },\n  font_bold: { en: 'Bold', ja: '太文字' },"
);
fs.writeFileSync('src/i18n.ts', content);
console.log('Fixed i18n for font');
