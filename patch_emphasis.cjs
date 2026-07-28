const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Update Math.max(0.01, ...) to Math.max(0.1, ...)
code = code.replace(/Math\.max\(0\.01/g, 'Math.max(0.1');

// Update handleEmphasizeClear
const regexClear = /  const handleEmphasizeClear = \(\) => \{[\s\S]*?  \};/m;
const newClear = `  const handleEmphasizeClear = () => {
    applyTransformToSelectionOrWord((text) => {
      return text.replace(/[\\(\\)\\[\\]]/g, '').replace(/:\\s*[0-9.]+/g, '');
    });
  };`;
code = code.replace(regexClear, newClear);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
