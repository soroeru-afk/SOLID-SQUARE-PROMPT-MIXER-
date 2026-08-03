const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const targetDivRegex = /<div \n\s*className=\{\`flex flex-col gap-1\.5 p-1 rounded transition-colors \$\{draggedCatId === key \? 'opacity-50' : 'hover:bg-bg-panel\/50'\}\`\}\n\s*key=\{key\}\n\s*draggable\n\s*onDragStart=\{\(e\) => handleDragStart\(e, key\)\}\n\s*onDragOver=\{handleDragOver\}\n\s*onDrop=\{\(e\) => handleDrop\(e, key\)\}\n\s*>/m;

const newTargetDiv = `<div 
        className={\`flex flex-col gap-1.5 p-1 rounded transition-colors \${draggedCatId === key ? 'opacity-50' : 'hover:bg-bg-panel/50'}\`}
        key={key}
        draggable={!isRenaming}
        onDragStart={(e) => {
          if (isRenaming) { e.preventDefault(); e.stopPropagation(); return; }
          handleDragStart(e, key);
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, key)}
      >`;

content = content.replace(targetDivRegex, newTargetDiv);

// update input element to stop propagation
const targetInputRegex = /<input \n\s*autoFocus\n\s*className="bg-bg-input border border-border-main rounded px-2 py-0\.5 text-\[13px\] text-text-main font-mono w-full"/m;

const newTargetInput = `<input 
                autoFocus
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="bg-bg-input border border-border-main rounded px-2 py-0.5 text-[13px] text-text-main font-mono w-full"`;

content = content.replace(targetInputRegex, newTargetInput);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
