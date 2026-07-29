const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleSelectNegativeId = \(id: string \| null, insert: boolean = true\) => \{\n\s*if \(id && insert\) \{\n\s*const newNeg = data\.negatives\?\.find\(m => m\.id === id\);\n\s*if \(newNeg\) \{\n\s*if \(activeEditor === 'positive'\) \{\n\s*let newPos = 0;\n\s*setEditorText\(prev => \{\n\s*const actualPos = positiveCursorPos === null \? prev\.length : positiveCursorPos;\n\s*const before = prev\.slice\(0, actualPos\);\n\s*const after = prev\.slice\(actualPos\);\n\s*const prefix = autoOptimize && before\.length > 0 && !before\.endsWith\(', '\) && !before\.endsWith\(','\) && !before\.endsWith\(' '\) && !before\.endsWith\('\\n'\) \? ', ' : '';\n\s*const suffix = autoOptimize && after\.length > 0 && !after\.startsWith\(','\) && !after\.startsWith\(' '\) && !after\.startsWith\('\\n'\) \? ', ' : '';\n\s*const insertedStr = prefix \+ newNeg\.content \+ suffix;\n\s*newPos = actualPos \+ insertedStr\.length;\n\s*return cleanString\(before \+ insertedStr \+ after\);\n\s*\}\);\n\s*setTimeout\(\(\) => setPositiveCursorPos\(newPos\), 0\);\n\s*\} else \{\n\s*let newPos = 0;\n\s*setNegativeEditorText\(prev => \{\n\s*const actualPos = negativeCursorPos === null \? prev\.length : negativeCursorPos;\n\s*const before = prev\.slice\(0, actualPos\);\n\s*const after = prev\.slice\(actualPos\);\n\s*const prefix = autoOptimize && before\.length > 0 && !before\.endsWith\(', '\) && !before\.endsWith\(','\) && !before\.endsWith\(' '\) && !before\.endsWith\('\\n'\) \? ', ' : '';\n\s*const suffix = autoOptimize && after\.length > 0 && !after\.startsWith\(','\) && !after\.startsWith\(' '\) && !after\.startsWith\('\\n'\) \? ', ' : '';\n\s*const insertedStr = prefix \+ newNeg\.content \+ suffix;\n\s*newPos = actualPos \+ insertedStr\.length;\n\s*return cleanString\(before \+ insertedStr \+ after\);\n\s*\}\);\n\s*setTimeout\(\(\) => setNegativeCursorPos\(newPos\), 0\);\n\s*\}\n\s*\}\n\s*\}\n\s*setSelectedNegativeId\(id\);\n\s*setActivePartId\(null\);\n\s*\};/,
  `const handleSelectNegativeId = (id: string | null, insert: boolean = true) => {
    if (id && insert) {
      const newNeg = data.negatives?.find(m => m.id === id);
      if (newNeg) {
        let newPos = 0;
        setNegativeEditorText(prev => {
          const actualPos = negativeCursorPos === null ? prev.length : negativeCursorPos;
          const before = prev.slice(0, actualPos);
          const after = prev.slice(actualPos);
          const prefix = autoOptimize && before.length > 0 && !before.endsWith(', ') && !before.endsWith(',') && !before.endsWith(' ') && !before.endsWith('\\n') ? ', ' : '';
          const suffix = autoOptimize && after.length > 0 && !after.startsWith(',') && !after.startsWith(' ') && !after.startsWith('\\n') ? ', ' : '';
          const insertedStr = prefix + newNeg.content + suffix;
          newPos = actualPos + insertedStr.length;
          return cleanString(before + insertedStr + after);
        });
        setTimeout(() => setNegativeCursorPos(newPos), 0);
      }
    }
    setSelectedNegativeId(id);
    setActivePartId(null);
  };`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched negative insert");
