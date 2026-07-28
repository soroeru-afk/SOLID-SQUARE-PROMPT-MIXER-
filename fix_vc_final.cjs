const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// Undo the second fix
code = code.replace(/<\/div>\n      \) : \(\n        children\n      \)\}\n      <ConfirmModal\n        isOpen=\{confirmBulkDelete\}/, "</div>\n      <ConfirmModal\n        isOpen={confirmBulkDelete}");

// Undo the first fix
code = code.replace(/<\/div>\n      \) : \(\n        children\n      \)\}\n\n      <ConfirmModal\n        isOpen=\{confirmDeleteId !== null\}/, "</div>\n\n      <ConfirmModal\n        isOpen={confirmDeleteId !== null}");

// Now let's find the proper place to close the ternary.
// We want to wrap from `<div className="p-4 flex-1 ...` down to the end of `{onDeleteAll && ... }`.
const ternaryEndRegex = /(\{onDeleteAll && \([\s\S]*?<\/div>\n\s*\)\})/;
code = code.replace(ternaryEndRegex, "$1\n      ) : (\n        children\n      )}");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
