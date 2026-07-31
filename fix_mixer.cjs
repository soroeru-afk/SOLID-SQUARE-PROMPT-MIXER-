const fs = require('fs');

const code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

let newCode = code.replace(/const \[isOpen, setIsOpen\] = useState\(false\);/, '')
  .replace(/const containerRef = useRef<HTMLDivElement>\(null\);/, '')
  .replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, '');

// Replace the return block
newCode = newCode.replace(/return \([\s\S]*?\);\s*};/, `return (
    <div className="w-full flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1.5 border-b border-border-main pb-3 mb-1">
        <label className="text-[13px] font-bold text-text-main font-mono">🔍 置換対象のキーワード (手動)</label>
        <input 
          type="text" 
          placeholder="例: japanese girl (空なら先頭挿入)"
          value={targetText}
          onChange={e => setTargetText(e.target.value)}
          className="bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main placeholder-text-dim"
        />
        <span className="text-[11px] text-text-dim font-mono leading-tight mt-1">
          ※上の窓に入力した文字を、以下の選択内容で全て上書き置換します。
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] text-text-dim font-mono">人種 (Race)</label>
        <select value={race} onChange={e => setRace(e.target.value)} className="bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main">
          {RACE_OPTIONS.map(o => <option key={o.label} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] text-text-dim font-mono">年齢 (Age)</label>
        <select value={age} onChange={e => setAge(e.target.value)} className="bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main">
          {AGE_OPTIONS.map(o => <option key={o.label} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] text-text-dim font-mono">体型 (Physique)</label>
        <select value={physique} onChange={e => setPhysique(e.target.value)} className="bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main">
          {PHYSIQUE_OPTIONS.map(o => <option key={o.label} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] text-text-dim font-mono">アングル (Angle)</label>
        <select value={angle} onChange={e => setAngle(e.target.value)} className="bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main">
          {ANGLE_OPTIONS.map(o => <option key={o.label} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-border-main">
        <label className="text-[13px] text-text-dim font-mono font-bold">男 (Partner)</label>
        
        <label className="flex items-center gap-2 cursor-pointer bg-bg-surface p-2 rounded border border-border-main">
          <input 
            type="checkbox" 
            checked={partnerOn}
            onChange={e => setPartnerOn(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-[13px] text-text-main font-mono">男を出す (ネガプロを自動付与)</span>
        </label>
        
        {partnerOn && (
          <select value={partnerTypeIdx} onChange={e => setPartnerTypeIdx(Number(e.target.value))} className="bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main mt-1">
            {PARTNER_TYPES.map((o, idx) => <option key={o.label} value={idx}>{o.label}</option>)}
          </select>
        )}
      </div>

      <div className="flex gap-2 pt-2 mt-2 border-t border-border-main">
        <button 
          onClick={handleReset}
          className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded text-[13px] font-mono font-bold transition-colors"
        >
          リセット
        </button>
        <button 
          onClick={handleApply}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-[13px] font-mono font-bold transition-colors flex items-center justify-center gap-1"
        >
          <Check className="w-4 h-4" /> 適用する
        </button>
      </div>
    </div>
  );
};`);

fs.writeFileSync('src/components/AttributeMixer.tsx', newCode);
console.log("Updated AttributeMixer.tsx");
