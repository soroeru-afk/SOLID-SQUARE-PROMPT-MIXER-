const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldMemoSelect = /const handleSelectMemoId = \(id: string \| null, insert: boolean = true\) => \{[\s\S]*?\}\n\s*\};\n\s*const handleAddMemo = /;

const newMemoSelect = `const handleSelectMemoId = (id: string | null, insert: boolean = true) => {
    setSelectedMemoId(id);
    if (insert && id) {
      const memo = data.memos?.find(m => m.id === id);
      if (memo) {
        if (activeEditor === 'negative') {
          setNegativeEditorText(prev => {
            if (prev && prev.trim().length > 0) return prev;
            return memo.content;
          });
        } else {
          setEditorText(prev => {
            if (prev && prev.trim().length > 0) return prev;
            return memo.content;
          });
        }
      }
    }
  };
  const handleAddMemo = `;

code = code.replace(oldMemoSelect, newMemoSelect);
fs.writeFileSync('src/App.tsx', code);
