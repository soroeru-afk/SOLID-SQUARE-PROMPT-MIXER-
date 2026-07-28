const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const regex = /<\/div>\s*<ConfirmModal\s*isOpen=\{confirmBulkDelete\}/;
code = code.replace(regex, "</div>\n      ) : (\n        children\n      )}\n      <ConfirmModal\n        isOpen={confirmBulkDelete}");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
