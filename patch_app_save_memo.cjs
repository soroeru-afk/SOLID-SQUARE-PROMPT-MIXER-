const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const saveAsPartRegex = /onSaveAsPart=\{handleSaveAsPart\}/;
code = code.replace(saveAsPartRegex, "onSaveAsPart={handleSaveAsPart}\n            onSaveAsMemo={(name, content) => {\n              const newMemo = { id: `memo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name, content };\n              setData(prev => ({ ...prev, memos: [newMemo, ...(prev.memos || [])] }));\n            }}");

fs.writeFileSync('src/App.tsx', code);
