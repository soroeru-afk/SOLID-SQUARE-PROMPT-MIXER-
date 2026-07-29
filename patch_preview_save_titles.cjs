const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;/,
  "const title = selectedMasterId && selectedMasterName ? selectedMasterName : (firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine);"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
