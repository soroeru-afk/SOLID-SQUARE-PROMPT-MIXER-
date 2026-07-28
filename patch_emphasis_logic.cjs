const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexAdd = /  const handleEmphasizeAdd = \(\) => \{[\s\S]*?  \};/m;
const regexRemove = /  const handleEmphasizeRemove = \(\) => \{[\s\S]*?  \};/m;
const regexClear = /  const handleEmphasizeClear = \(\) => \{[\s\S]*?  \};/m;

const newAdd = `  const handleEmphasizeAdd = () => {
    applyTransformToSelectionOrWord((text) => {
      let clean = text;
      while(true) {
        let prev = clean;
        clean = clean.replace(/^[\\(\\[\\s]+/, '').replace(/[\\)\\]\\s]+$/, '').replace(/:[0-9.]*$/, '');
        if (prev === clean) break;
      }
      let weight = 1.0;
      let m = text.match(/:([0-9.]+)[)\\]]*$/);
      if (m) {
        weight = parseFloat(m[1]);
      } else if (/^[\\(\\[]/.test(text.trim())) {
        weight = 1.1;
      }
      let newWeight = weight + 0.1;
      newWeight = Math.round(newWeight * 100) / 100;
      return \`(\${clean}:\${newWeight})\`;
    });
  };`;

const newRemove = `  const handleEmphasizeRemove = () => {
    applyTransformToSelectionOrWord((text) => {
      let clean = text;
      while(true) {
        let prev = clean;
        clean = clean.replace(/^[\\(\\[\\s]+/, '').replace(/[\\)\\]\\s]+$/, '').replace(/:[0-9.]*$/, '');
        if (prev === clean) break;
      }
      let weight = 1.0;
      let m = text.match(/:([0-9.]+)[)\\]]*$/);
      if (m) {
        weight = parseFloat(m[1]);
      } else if (/^[\\(\\[]/.test(text.trim())) {
        weight = 1.1;
      }
      let newWeight = weight - 0.1;
      newWeight = Math.max(0.01, Math.round(newWeight * 100) / 100);
      return \`(\${clean}:\${newWeight})\`;
    });
  };`;

const newClear = `  const handleEmphasizeClear = () => {
    applyTransformToSelectionOrWord((text) => {
      let clean = text;
      while(true) {
        let prev = clean;
        clean = clean.replace(/^[\\(\\[\\s]+/, '').replace(/[\\)\\]\\s]+$/, '').replace(/:[0-9.]*$/, '');
        if (prev === clean) break;
      }
      return clean;
    });
  };`;

code = code.replace(regexAdd, newAdd);
code = code.replace(regexRemove, newRemove);
code = code.replace(regexClear, newClear);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
