const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const oldRemove = `  const handleEmphasizeRemove = () => {
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
  };`;

const newRemove = `  const handleEmphasizeRemove = () => {
    applyTransformToSelectionOrWord((text) => {
      let match = text.match(/^\\((.+?):([0-9.]+)\\)$/);
      if (match) {
         let newWeight = parseFloat(match[2]) - 0.1;
         newWeight = Math.round(newWeight * 100) / 100;
         if (newWeight <= 1.0) {
           return match[1];
         }
         return \`(\${match[1]}:\${newWeight})\`;
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
  };`;

code = code.replace(oldRemove, newRemove);

const oldButtons = `<button 
            onClick={handleEmphasizeClear}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Clear All Emphasis"
          >Clear</button>
          <button 
            onClick={() => handleEmphasizeChange(0.1)}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Increase weight +0.1"
          >+0.1</button>
          <button 
            onClick={() => handleEmphasizeChange(-0.1)}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Decrease weight -0.1"
          >-0.1</button>`;

const newButtons = `<button 
            onClick={handleEmphasizeClear}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Clear All Emphasis"
          >Clear</button>`;

code = code.replace(oldButtons, newButtons);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
