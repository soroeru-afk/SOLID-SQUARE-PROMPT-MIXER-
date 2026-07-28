const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const newHandlers = `
  const handleEmphasizeAdd = () => {
    applyTransformToSelectionOrWord((text) => {
      let match = text.match(/^\\((.+?):([0-9.]+)\\)$/);
      if (match) {
        let newWeight = parseFloat(match[2]) + 0.1;
        newWeight = Math.round(newWeight * 100) / 100;
        return \`(\${match[1]}:\${newWeight})\`;
      }
      match = text.match(/^\\((.+?)\\)$/);
      if (match) {
        return \`(\${match[1]}:1.1)\`;
      }
      return \`(\${text}:1.1)\`;
    });
  };

  const handleEmphasizeRemove = () => {
    applyTransformToSelectionOrWord((text) => {
      let match = text.match(/^\\((.+?):([0-9.]+)\\)$/);
      if (match) {
         return match[1];
      }
      match = text.match(/^\\((.+?)\\)$/);
      if (match) {
         return match[1];
      }
      match = text.match(/^\\[(.+?)\\]$/);
      if (match) {
         return match[1];
      }
      return text;
    });
  };

  const handleEmphasizeClear = () => {
    applyTransformToSelectionOrWord((text) => {
      let res = text;
      let changed = true;
      while (changed) {
        changed = false;
        let m = res.match(/^[\\(\\[](.+?)(:[0-9.]+)?[\\)\\]]$/);
        if (m) {
          res = m[1];
          changed = true;
        }
      }
      return res;
    });
  };

  const handleEmphasizeChange =`;

code = code.replace("  const handleEmphasizeChange =", newHandlers);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
