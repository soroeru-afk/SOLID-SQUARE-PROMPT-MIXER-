const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const targetLabel = '<label className="text-[13px] text-text-dim font-mono">{label}</label>';
const replacementLabel = `<div className="flex items-center justify-between">
          <label className="text-[13px] text-text-dim font-mono">{label}</label>
          {!isEditMode && (
            <button
              onClick={() => handleApplySingle(key)}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-colors shrink-0 flex items-center gap-1"
              title="この項目だけを適用"
            >
              <Check className="w-2.5 h-2.5" /> 適用
            </button>
          )}
        </div>`;

code = code.replace(targetLabel, replacementLabel);

const targetSelectBtn = `            <select 
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

const replacementSelectBtn = `            <select 
              value={currentIdx} 
              onChange={e => setSelections(prev => ({ ...prev, [key]: Number(e.target.value) }))} 
              className="flex-1 bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main"
            >
              {items.map((o, idx) => <option key={idx} value={idx}>{o.label}</option>)}
            </select>
          </div>`;
          
code = code.replace(targetSelectBtn, replacementSelectBtn);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
