const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexBtn = />\( \) Clear<\/button>/;
code = code.replace(regexBtn, ">{t('emphasize_clear', lang)}</button>");

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
