const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. Remove the top buttons block
const topButtonsBlockRegex = /<div className="flex gap-2 pb-3 mb-1 border-b border-border-main">[\s\S]*?<\/button>\s*<\/div>\s*<div className="flex flex-col gap-1\.5 border-b border-border-main pb-3 mb-1 mt-2">/;
code = code.replace(topButtonsBlockRegex, '<div className="flex flex-col gap-1.5 border-b border-border-main pb-3 mb-1 mt-2">');

// 2. Add handleApplySingle
const handleApplySingleCode = `  const handleApplySingle = (key: keyof Presets) => {
    const val = presets[key][selections[key]]?.value || '';
    if (!val) return;
    onApply(val, '', targetText);
  };`;

code = code.replace(
  /const handleApply = \(\) => \{/,
  handleApplySingleCode + '\n\n  const handleApply = () => {'
);

// 3. Add small apply button to each category
const selectBlock = `<div className="flex gap-2 items-start">
            <select 
              value={currentIdx} 
              onChange={e => setSelections(prev => ({ ...prev, [key]: Number(e.target.value) }))} 
              className="flex-1 bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main"
            >
              {items.map((o, idx) => <option key={idx} value={idx}>{o.label}</option>)}
            </select>
          </div>`;
          
const newSelectBlock = `<div className="flex gap-2 items-start">
            <select 
              value={currentIdx} 
              onChange={e => setSelections(prev => ({ ...prev, [key]: Number(e.target.value) }))} 
              className="flex-1 bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main"
            >
              {items.map((o, idx) => <option key={idx} value={idx}>{o.label}</option>)}
            </select>
            <button
              onClick={() => handleApplySingle(key)}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[12px] font-bold transition-colors shrink-0 flex items-center gap-1"
              title="この項目だけを適用"
            >
              <Check className="w-3 h-3" /> 適用
            </button>
          </div>`;

code = code.replace(selectBlock, newSelectBlock);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
