const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const targetBtn = `<button
            onClick={() => setEditModes(prev => ({ ...prev, [key]: !prev[key] }))}
            className={\`px-2 py-0.5 rounded text-[10px] font-bold transition-colors shrink-0 flex items-center gap-1 \${
              isEditing 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : 'bg-bg-surface hover:bg-bg-input text-text-dim border border-border-main'
            }\`}
          >`;

const replacementBtn = `<button
            onClick={() => setEditModes(prev => ({ ...prev, [key]: !prev[key] }))}
            className={\`w-[64px] justify-center px-2 py-0.5 rounded text-[10px] font-bold transition-colors shrink-0 flex items-center gap-1 border \${
              isEditing 
                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600' 
                : 'bg-bg-surface hover:bg-bg-input text-text-dim border-border-main'
            }\`}
          >`;

code = code.replace(targetBtn, replacementBtn);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
