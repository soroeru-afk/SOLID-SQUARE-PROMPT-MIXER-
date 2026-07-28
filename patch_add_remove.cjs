const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexAdd = /  const handleEmphasizeAdd = \(\) => \{[\s\S]*?  \};/m;
const regexRemove = /  const handleEmphasizeRemove = \(\) => \{[\s\S]*?  \};/m;

const newAdd = `  const handleEmphasizeAdd = () => {
    applyTransformToSelectionOrWord((text) => {
      let weight = 1.0;
      let m = text.match(/:([0-9.]+)[)\\]]*$/);
      if (m) {
        weight = parseFloat(m[1]);
      } else if (/^[\\(\\[]/.test(text.trim())) {
        weight = 1.1;
      }
      
      let clean = text.replace(/[\\(\\)\\[\\]]/g, '').replace(/:\\s*[0-9.]+/g, '');
      
      let newWeight = weight + 0.1;
      newWeight = Math.round(newWeight * 100) / 100;
      return \`(\${clean}:\${newWeight})\`;
    });
  };`;

const newRemove = `  const handleEmphasizeRemove = () => {
    applyTransformToSelectionOrWord((text) => {
      let weight = 1.0;
      let m = text.match(/:([0-9.]+)[)\\]]*$/);
      if (m) {
        weight = parseFloat(m[1]);
      } else if (/^[\\(\\[]/.test(text.trim())) {
        weight = 1.1;
      }
      
      let clean = text.replace(/[\\(\\)\\[\\]]/g, '').replace(/:\\s*[0-9.]+/g, '');
      
      let newWeight = weight - 0.1;
      newWeight = Math.max(0.1, Math.round(newWeight * 100) / 100);
      return \`(\${clean}:\${newWeight})\`;
    });
  };`;

code = code.replace(regexAdd, newAdd);
code = code.replace(regexRemove, newRemove);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
