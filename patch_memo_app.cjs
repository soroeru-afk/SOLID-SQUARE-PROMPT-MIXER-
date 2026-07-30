const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const handlersToAdd = `
  const handleDuplicateMemo = (id: string) => {
    setData(prev => {
      const original = (prev.memos || []).find(m => m.id === id);
      if (!original) return prev;
      const copy = { ...original, id: \`memo_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`, name: \`\${original.name} コピー\` };
      return { ...prev, memos: [copy, ...(prev.memos || [])] };
    });
  };
`;

code = code.replace(
  /const handleUpdateMemo = \(id: string, updates: Partial<MasterPrompt>\) => \{/,
  handlersToAdd + "\n  const handleUpdateMemo = (id: string, updates: Partial<MasterPrompt>) => {"
);

code = code.replace(
  /onUpdate=\{handleUpdateMemo\}\n\s*onDelete=\{handleDeleteMemo\}/g,
  "onUpdate={handleUpdateMemo}\n                onDuplicate={handleDuplicateMemo}\n                onDelete={handleDeleteMemo}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for memos");
