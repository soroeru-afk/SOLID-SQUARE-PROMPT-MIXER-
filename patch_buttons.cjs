const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const oldButtons = `<div className="w-px h-6 bg-border-main mx-1"></div>
        
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleEmphasizeAdd}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Add Emphasis ()"
          >( )</button>
          <button 
            onClick={handleEmphasizeRemove}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Remove 1 Layer of Emphasis"
          >Un-( )</button>
          <button 
            onClick={handleEmphasizeClear}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Clear All Emphasis"
          >Clear ( )</button>
          <button 
            onClick={() => handleEmphasizeChange(0.1)}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Increase weight +0.1"
          >+0.1</button>
          <button 
            onClick={() => handleEmphasizeChange(-0.1)}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Decrease weight -0.1"
          >-0.1</button>
        </div>`;

const newButtons = `<div className="w-px h-6 bg-border-main mx-1"></div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleEmphasizeAdd}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Add Emphasis ()"
          >+( )</button>
          <button 
            onClick={handleEmphasizeRemove}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Remove 1 Layer of Emphasis"
          >-( )</button>
          <button 
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
          >-0.1</button>
        </div>`;

code = code.replace(oldButtons, newButtons);

// Make sure handleEmphasizeAdd adds 1.1 explicitly
code = code.replace(/return \`\\(\\\$\{text\}:1\.1\\)\`;/, 'return `(${text}:1.1)`;');
code = code.replace(/return \`\\(\\\$\{match\[1\]\}:1\.1\\)\`;/, 'return `(${match[1]}:1.1)`;');

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
