const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  "  selectedMemoName,\n  uniqueCategories = [],",
  "  selectedMemoName,\n  selectedMasterId,\n  selectedMasterName,\n  selectedNegativeId,\n  selectedNegativeName,\n  selectedPartId,\n  selectedPartName,\n  uniqueCategories = [],"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn destruct");
