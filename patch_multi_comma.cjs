const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexAdd = /  const handleEmphasizeAdd = \(\) => \{[\s\S]*?  \};/m;
const regexRemove = /  const handleEmphasizeRemove = \(\) => \{[\s\S]*?  \};/m;
const regexClear = /  const handleEmphasizeClear = \(\) => \{[\s\S]*?  \};/m;

const newAdd = `  const handleEmphasizeAdd = () => {
    applyTransformToSelectionOrWord((text) => {
      return text.split(',').map(part => {
        let trimmed = part.trim();
        if (!trimmed) return part;
        let weight = 1.0;
        let m = trimmed.match(/:([0-9.]+)[)\\]]*$/);
        if (m) {
          weight = parseFloat(m[1]);
        } else if (/^[\\(\\[]/.test(trimmed)) {
          weight = 1.1;
        }
        
        let clean = trimmed.replace(/[\\(\\)\\[\\]]/g, '').replace(/:\\s*[0-9.]+/g, '');
        if (!clean) return part;
        
        let newWeight = weight + 0.1;
        newWeight = Math.round(newWeight * 100) / 100;
        return part.replace(trimmed, \`(\${clean}:\${newWeight})\`);
      }).join(',');
    });
  };`;

const newRemove = `  const handleEmphasizeRemove = () => {
    applyTransformToSelectionOrWord((text) => {
      return text.split(',').map(part => {
        let trimmed = part.trim();
        if (!trimmed) return part;
        let weight = 1.0;
        let m = trimmed.match(/:([0-9.]+)[)\\]]*$/);
        if (m) {
          weight = parseFloat(m[1]);
        } else if (/^[\\(\\[]/.test(trimmed)) {
          weight = 1.1;
        }
        
        let clean = trimmed.replace(/[\\(\\)\\[\\]]/g, '').replace(/:\\s*[0-9.]+/g, '');
        if (!clean) return part;
        
        let newWeight = weight - 0.1;
        newWeight = Math.max(0.1, Math.round(newWeight * 100) / 100);
        return part.replace(trimmed, \`(\${clean}:\${newWeight})\`);
      }).join(',');
    });
  };`;

const newClear = `  const handleEmphasizeClear = () => {
    applyTransformToSelectionOrWord((text) => {
      return text.split(',').map(part => {
        let trimmed = part.trim();
        if (!trimmed) return part;
        let clean = trimmed.replace(/[\\(\\)\\[\\]]/g, '').replace(/:\\s*[0-9.]+/g, '');
        if (!clean) return part;
        return part.replace(trimmed, clean);
      }).join(',');
    });
  };`;

code = code.replace(regexAdd, newAdd);
code = code.replace(regexRemove, newRemove);
code = code.replace(regexClear, newClear);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
