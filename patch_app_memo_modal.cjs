const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to pass selectedMemoId and selectedMemoName to PreviewColumn
// And modify onSaveAsMemo

const memoRegex = /onSaveAsMemo=\{\(name, content\) => \{\n\s*const newMemo = \{ id: `memo_\$\{Date\.now\(\)\}_\$\{Math\.random\(\)\.toString\(36\)\.substr\(2, 9\)\}`, name, content \};\n\s*setData\(prev => \(\{ \.\.\.prev, memos: \[newMemo, \.\.\.\(prev\.memos \|\| \[\]\)\] \}\)\);\n\s*\}\}/;

const newMemoLogic = `onSaveAsMemo={(name, content, isUpdate) => {
              if (isUpdate && selectedMemoId) {
                handleUpdateMemo(selectedMemoId, { name, content });
              } else {
                const newMemo = { id: \`memo_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`, name, content };
                setData(prev => ({ ...prev, memos: [newMemo, ...(prev.memos || [])] }));
                setSelectedMemoId(newMemo.id);
              }
            }}
            selectedMemoId={selectedMemoId}
            selectedMemoName={data.memos?.find(m => m.id === selectedMemoId)?.name}`;

code = code.replace(memoRegex, newMemoLogic);

fs.writeFileSync('src/App.tsx', code);
