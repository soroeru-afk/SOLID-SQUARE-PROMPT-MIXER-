const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const handlersToAdd = `  const handleDuplicateMaster = (id: string) => {
    setData(prev => {
      const original = prev.masters.find(m => m.id === id);
      if (!original) return prev;
      const copy = { ...original, id: \`m_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`, name: \`\${original.name} コピー\` };
      return { ...prev, masters: [copy, ...prev.masters] };
    });
  };

  const handleDuplicateNegative = (id: string) => {
    setData(prev => {
      const original = (prev.negatives || []).find(m => m.id === id);
      if (!original) return prev;
      const copy = { ...original, id: \`m_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`, name: \`\${original.name} コピー\` };
      return { ...prev, negatives: [copy, ...(prev.negatives || [])] };
    });
  };

  const handleDuplicatePart = (id: string) => {
    setData(prev => {
      const original = prev.parts.find(p => p.id === id);
      if (!original) return prev;
      const copy = { ...original, id: \`p_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`, name: \`\${original.name} コピー\` };
      return { ...prev, parts: [copy, ...prev.parts] };
    });
  };
`;

code = code.replace(
  /const handleAddMaster = \(name: string = 'NEW_MASTER', content: string = 'new content', negativeContent\?: string\) => \{/,
  handlersToAdd + "\n  const handleAddMaster = (name: string = 'NEW_MASTER', content: string = 'new content', negativeContent?: string) => {"
);

code = code.replace(
  /onUpdate=\{handleUpdateMaster\}\n\s*onUpdateNegative=\{handleUpdateNegative\}/g,
  "onUpdate={handleUpdateMaster}\n              onUpdateNegative={handleUpdateNegative}\n              onDuplicate={handleDuplicateMaster}\n              onDuplicateNegative={handleDuplicateNegative}"
);

code = code.replace(
  /onUpdate=\{handleUpdatePart\}\n\s*onDelete=\{handleDeletePart\}/g,
  "onUpdate={handleUpdatePart}\n              onDuplicate={handleDuplicatePart}\n              onDelete={handleDeletePart}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with duplicate handlers");
