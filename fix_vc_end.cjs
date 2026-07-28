const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// I need to find the `</div>\n      <ConfirmModal` which indicates the end of the parts content
code = code.replace(/<\/div>\n\s*<ConfirmModal\n\s*isOpen=\{confirmDeleteId !== null\}/, "</div>\n      ) : (\n        children\n      )}\n\n      <ConfirmModal\n        isOpen={confirmDeleteId !== null}");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
