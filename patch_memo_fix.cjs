const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

code = code.replace(/onSelectNegative: [^\n]+\n/g, '');
code = code.replace(/onAddNegative: [^\n]+\n/g, '');
code = code.replace(/onUpdateNegative: [^\n]+\n/g, '');
code = code.replace(/onDeleteNegative: [^\n]+\n/g, '');
code = code.replace(/onDeleteBulkNegative\?: [^\n]+\n/g, '');
code = code.replace(/onDeleteAllNegative\?: [^\n]+\n/g, '');
code = code.replace(/onMoveBulkNegative\?: [^\n]+\n/g, '');
code = code.replace(/onReorderNegative\?: [^\n]+\n/g, '');

code = code.replace(/onSelectNegative,\s*/g, '');
code = code.replace(/onAddNegative,\s*/g, '');
code = code.replace(/onUpdateNegative,\s*/g, '');
code = code.replace(/onDeleteNegative,\s*/g, '');
code = code.replace(/onDeleteBulkNegative,\s*/g, '');
code = code.replace(/onDeleteAllNegative,\s*/g, '');
code = code.replace(/onMoveBulkNegative,\s*/g, '');
code = code.replace(/onReorderNegative,\s*/g, '');

fs.writeFileSync('src/components/MemoColumn.tsx', code);
