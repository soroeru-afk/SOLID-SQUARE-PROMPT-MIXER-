const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleSelectMasterId = \(id: string \| null, insert: boolean = true\) => \{\n\s*if \(id && insert\) \{\n\s*const newMaster = data\.masters\.find\(m => m\.id === id\);\n\s*if \(newMaster\) \{\n\s*if \(activeEditor === 'negative'\) \{/;

const replace = `const handleSelectMasterId = (id: string | null, insert: boolean = true) => {
    if (id && insert) {
      const newMaster = data.masters.find(m => m.id === id);
      if (newMaster) {
        if (newMaster.negativeContent !== undefined) {
          setEditorText(prev => {
            const actualPos = positiveCursorPos === null ? prev.length : positiveCursorPos;
            const before = prev.slice(0, actualPos);
            const after = prev.slice(actualPos);
            const prefix = autoOptimize && before.length > 0 && !before.endsWith(', ') && !before.endsWith(',') && !before.endsWith(' ') && !before.endsWith('\\n') ? ', ' : '';
            const suffix = autoOptimize && after.length > 0 && !after.startsWith(',') && !after.startsWith(' ') && !after.startsWith('\\n') ? ', ' : '';
            const insertedStr = prefix + newMaster.content + suffix;
            setTimeout(() => setPositiveCursorPos(actualPos + insertedStr.length), 0);
            return cleanString(before + insertedStr + after);
          });
          setNegativeEditorText(prev => {
            const actualPos = negativeCursorPos === null ? prev.length : negativeCursorPos;
            const before = prev.slice(0, actualPos);
            const after = prev.slice(actualPos);
            const prefix = autoOptimize && before.length > 0 && !before.endsWith(', ') && !before.endsWith(',') && !before.endsWith(' ') && !before.endsWith('\\n') ? ', ' : '';
            const suffix = autoOptimize && after.length > 0 && !after.startsWith(',') && !after.startsWith(' ') && !after.startsWith('\\n') ? ', ' : '';
            const insertedStr = prefix + newMaster.negativeContent + suffix;
            setTimeout(() => setNegativeCursorPos(actualPos + insertedStr.length), 0);
            return cleanString(before + insertedStr + after);
          });
        } else if (activeEditor === 'negative') {`;

code = code.replace(regex, replace);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched insert set logic");
