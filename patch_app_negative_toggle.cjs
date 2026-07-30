const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const handlersToAdd = `
  const handleTogglePartNegative = (id: string) => {
    setData((prev) => ({
      ...prev,
      parts: prev.parts.map((p) =>
        p.id === id ? { ...p, isNegative: !p.isNegative } : p
      ),
    }));
  };
`;

code = code.replace(
  /const handleTogglePin = \(id: string\) => \{/,
  handlersToAdd + "\n  const handleTogglePin = (id: string) => {"
);

code = code.replace(
  /onTogglePin=\{handleTogglePin\}/g,
  "onTogglePin={handleTogglePin}\n              onTogglePartNegative={handleTogglePartNegative}"
);

// Also we should modify handleTogglePart so that if part.isNegative is true, it inserts into negative editor
const insertLogicOld = `    if (activeEditor === 'negative') {
      setNegativeEditorText(prev => insert(prev, negativeCursorPos, setNegativeCursorPos as any));
    } else {
      setEditorText(prev => insert(prev, positiveCursorPos, setPositiveCursorPos as any));
    }`;

const insertLogicNew = `    if (part.isNegative || activeEditor === 'negative') {
      setNegativeEditorText(prev => insert(prev, negativeCursorPos, setNegativeCursorPos as any));
    } else {
      setEditorText(prev => insert(prev, positiveCursorPos, setPositiveCursorPos as any));
    }`;

code = code.replace(insertLogicOld, insertLogicNew);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx with handleTogglePartNegative");
