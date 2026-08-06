const fs = require('fs');
let content = fs.readFileSync('src/i18n.ts', 'utf8');

content = content.replace(/import_json: \{ en: 'IMPORT_JSON', ja: 'JSON読込' \}/, "import_json: { en: 'IMPORT', ja: 'インポート' }");
content = content.replace(/export_config: \{ en: 'EXPORT_CONFIG', ja: '設定書出' \}/, "export_config: { en: 'EXPORT', ja: 'エクスポート' }");

fs.writeFileSync('src/i18n.ts', content);
console.log('Fixed i18n text');
