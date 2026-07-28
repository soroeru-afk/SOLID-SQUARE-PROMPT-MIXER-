const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// 1. Add isAllExpanded state
const expandRegex = /const \[expandId, setExpandId\] = useState\(0\);\n  const \[collapseId, setCollapseId\] = useState\(0\);/;
code = code.replace(expandRegex, `const [expandId, setExpandId] = useState(0);
  const [collapseId, setCollapseId] = useState(0);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<number[]>(() => {
    const saved = localStorage.getItem('variation_section_order');
    return saved ? JSON.parse(saved) : [1, 2, 3, 4];
  });
  
  const moveSection = (secId: number, direction: 'up' | 'down') => {
    setSectionOrder(prev => {
      const idx = prev.indexOf(secId);
      if (idx < 0) return prev;
      const next = [...prev];
      if (direction === 'up' && idx > 0) {
        [next[idx-1], next[idx]] = [next[idx], next[idx-1]];
      } else if (direction === 'down' && idx < prev.length - 1) {
        [next[idx+1], next[idx]] = [next[idx], next[idx+1]];
      }
      localStorage.setItem('variation_section_order', JSON.stringify(next));
      return next;
    });
  };
`);

// 2. Replace expand/collapse buttons
const topButtonsRegex = /<div className="flex gap-2">\s*<button onClick=\{\(\) => setExpandId[\s\S]*?<\/button>\s*<\/div>/m;
code = code.replace(topButtonsRegex, `<div className="flex gap-2">
          <button 
            onClick={() => {
              if (isAllExpanded) {
                setCollapseId(prev => prev + 1);
              } else {
                setExpandId(prev => prev + 1);
              }
              setIsAllExpanded(!isAllExpanded);
            }} 
            className="px-3 py-1 bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded transition-colors whitespace-nowrap flex items-center gap-1"
          >
            {isAllExpanded ? <ChevronsUp size={12} /> : <ChevronsDown size={12} />}
            {isAllExpanded ? t('collapse_all', lang) : t('expand_all', lang)}
          </button>
        </div>`);

// 3. Update the loop mapping secId and secData
const loopRegex = /\{\(Object\.entries\(groupedParts\) as \[string, any\]\[\]\)\.map\(\(\[secId, secData\]\) => \{/;
code = code.replace(loopRegex, `{sectionOrder.map((secIdNum) => {
            const secId = String(secIdNum);
            const secData = groupedParts[secIdNum as keyof typeof groupedParts];
            if (!secData) return null;`);

// 4. Update the section header to include up/down arrows
const sectionHeaderRegex = /<h3 className="text-xs font-mono font-bold uppercase">\s*\{secData\.name\}\s*<\/h3>/m;
code = code.replace(sectionHeaderRegex, `<div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <button onClick={() => moveSection(Number(secId), 'up')} className="hover:text-text-main text-text-dim opacity-0 group-hover:opacity-100 transition-opacity"><ChevronUp size={12} /></button>
                      <button onClick={() => moveSection(Number(secId), 'down')} className="hover:text-text-main text-text-dim opacity-0 group-hover:opacity-100 transition-opacity"><ChevronDown size={12} /></button>
                    </div>
                    <h3 className="text-xs font-mono font-bold uppercase">
                      {secData.name}
                    </h3>
                  </div>`);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
