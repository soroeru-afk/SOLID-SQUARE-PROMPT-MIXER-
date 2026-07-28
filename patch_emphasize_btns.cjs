const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regex = /<div className="flex items-center space-x-1">\s*<button\s*onClick=\{handleEmphasizeAdd\}[\s\S]*?\( \) Clear<\/button>\s*<\/div>/m;

const replacement = `<div className="flex items-center space-x-1">
          <button 
            onClick={handleEmphasizeAdd}
            className={\`px-2 py-1 text-[10px] font-mono border rounded transition-colors \${
              theme === 'light' || theme === 'paper'
                ? 'bg-[#b45309]/5 hover:bg-[#b45309]/10 border-[#b45309]/40 text-[#b45309]'
                : 'bg-bg-surface hover:bg-amber-500/10 border-amber-500/40 text-amber-500'
            }\`}
            title="Add Emphasis ()"
          >+( )</button>
          <button 
            onClick={handleEmphasizeRemove}
            className={\`px-2 py-1 text-[10px] font-mono border rounded transition-colors \${
              theme === 'light' || theme === 'paper'
                ? 'bg-[#b45309]/5 hover:bg-[#b45309]/10 border-[#b45309]/40 text-[#b45309]'
                : 'bg-bg-surface hover:bg-amber-500/10 border-amber-500/40 text-amber-500'
            }\`}
            title="Remove 1 Layer of Emphasis"
          >-( )</button>
          <button 
            onClick={handleEmphasizeClear}
            className={\`px-2 py-1 text-[10px] font-mono border rounded transition-colors \${
              theme === 'light' || theme === 'paper'
                ? 'bg-[#b45309]/5 hover:bg-[#b45309]/10 border-[#b45309]/40 text-[#b45309]'
                : 'bg-bg-surface hover:bg-amber-500/10 border-amber-500/40 text-amber-500'
            }\`}
            title="Clear All Emphasis"
          >( ) Clear</button>
        </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
