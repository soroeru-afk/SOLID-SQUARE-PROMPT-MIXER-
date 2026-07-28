const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const oldBtn = `<button 
            onClick={handleEmphasizeClear}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Clear All Emphasis"
          >Clear</button>`;

const newBtn = `<button 
            onClick={handleEmphasizeClear}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Clear All Emphasis"
          >( ) Clear</button>`;

code = code.replace(oldBtn, newBtn);
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
