const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = "uniqueCategories={getUniqueCategories()}";
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
            selectedMemoName={data.memos?.find(m => m.id === selectedMemoId)?.name || ''}
            uniqueCategories={getUniqueCategories()}`;

code = code.replace(anchor, newMemoLogic);

fs.writeFileSync('src/App.tsx', code);
