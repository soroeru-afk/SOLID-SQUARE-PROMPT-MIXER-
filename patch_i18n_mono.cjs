const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf8');

code = code.replace(
  /theme_navy: \{ en: 'NAVY', ja: 'ネイビー' \},/,
  "theme_navy: { en: 'NAVY', ja: 'ネイビー' },\n  theme_mono: { en: 'MONO', ja: 'モノトーン' },"
);

fs.writeFileSync('src/i18n.ts', code);
console.log("Patched i18n");
