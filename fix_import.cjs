const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

if (!code.includes('import { AttributeMixer }')) {
  code = code.replace("import { Language, t } from '../i18n';", "import { Language, t } from '../i18n';\nimport { AttributeMixer } from './AttributeMixer';");
  fs.writeFileSync('src/components/VariationColumn.tsx', code);
  console.log("Import fixed");
}
