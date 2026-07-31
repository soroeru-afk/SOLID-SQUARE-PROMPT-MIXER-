const fs = require('fs');

const attributeMixerContent = `import React, { useState, useRef, useEffect } from 'react';
import { User, X, Check } from 'lucide-react';

export const RACE_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Japanese', value: 'japanese woman, (fair pale skin texture:1.3), ' },
  { label: 'British', value: 'british woman, (creamy white skin, elegant sharp facial features:1.3), ' },
  { label: 'Russian', value: 'russian woman, (pinkish white skin, soft light pink details:1.3), ' },
  { label: 'Brazilian', value: 'brazilian woman, (toned tan olive skin texture, dark sharp details:1.3), ' },
];

export const AGE_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Mature', value: '1mature female, young housewife, domestic vibe, maternal look, plain face, ' },
  { label: 'Middle-aged', value: '1middle-aged female, matronly figure, ordinary face, no makeup, ' },
  { label: 'High School Girl 🌟', value: '1japanese high school girl, school uniform, sailor fuku, young youth vibe, fresh soft skin texture, ordinary face, no makeup, ' },
];

export const PHYSIQUE_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'スリム・美しい体型 🌟', value: 'slender and beautiful body, slim physique, elegant body line, proportional, ' },
  { label: 'ガチ重量級', value: 'low chignon hair, athletic olistic heavyweight, colossal female, built like a tank, (fat:1.4), broad shoulders, thick arms, thick waist, wide hips, thick thighs, muffin top, skin indent, flesh indentation, spilling hips, ' },
  { label: 'Large', value: 'large heavy fat body, thick waist, wide hips, thick thighs, ' },
];

export const ANGLE_OPTIONS = [
  { label: 'None', value: '' },
  { label: '全身ショット 🌟', value: '(full length shot, complete body framing:1.3), deep perspective, ' },
  { label: '腰から上（ミディアム） 🌟', value: '(medium shot, waist up framing:1.3), upper body portrait, ' },
  { label: '斜めアングル', value: '(three-quarter view angle from the side:1.3), slightly offset camera, dynamic perspective, ' },
  { label: '完全真横寝', value: '(absolute full-length side view:1.4), lying on side, perfectly parallel to the ground, camera at floor level height, deep perspective, horizontal framing, ' },
  { label: 'ローアングル', value: '(camera at ground level height:1.4), (extreme low perspective looking up:1.3), ground filling the bottom of frame, ' },
];

export const PARTNER_TYPES = [
  { 
    label: '日本のじいさん', 
    pos: '(1old japanese man focus, aged wrinkled face, plain clothes:1.3), ', 
    neg: '(young man, boy:1.4), ' 
  },
  { 
    label: '普通の男子高校生', 
    pos: '(1japanese high school boy, school uniform, youthful male, slim build:1.3), ', 
    neg: '(old man, mature man:1.4), ' 
  },
  { 
    label: '178cm筋肉質男性', 
    pos: '(1muscular skinny american man focus, 178cm height, zero fat, athletic toned physique:1.3), ', 
    neg: '(fat man, heavy man, chubby man:1.5), ' 
  },
];

export const PARTNER_NEG_OFF = '(2people, couple, pair, extra people, multiple people:1.4), ';
export const PARTNER_NEG_ON_BASE = '(extra female:1.5), 2women, multiple girls, ';

export const ALL_KNOWN_POS_STRINGS = [
  ...RACE_OPTIONS.map(o => o.value).filter(Boolean),
  ...AGE_OPTIONS.map(o => o.value).filter(Boolean),
  ...PHYSIQUE_OPTIONS.map(o => o.value).filter(Boolean),
  ...ANGLE_OPTIONS.map(o => o.value).filter(Boolean),
  ...PARTNER_TYPES.map(o => o.pos).filter(Boolean),
];

export const ALL_KNOWN_NEG_STRINGS = [
  PARTNER_NEG_OFF,
  PARTNER_NEG_ON_BASE,
  ...PARTNER_TYPES.map(o => o.neg).filter(Boolean),
];

interface AttributeMixerProps {
  onApply: (pos: string, neg: string, target?: string) => void;
  theme?: string;
}

export const AttributeMixer: React.FC<AttributeMixerProps> = ({ onApply, theme = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetText, setTargetText] = useState('');
  const [race, setRace] = useState(RACE_OPTIONS[0].value);
  const [age, setAge] = useState(AGE_OPTIONS[0].value);
  const [physique, setPhysique] = useState(PHYSIQUE_OPTIONS[0].value);
  const [angle, setAngle] = useState(ANGLE_OPTIONS[0].value);
  const [partnerOn, setPartnerOn] = useState(false);
  const [partnerTypeIdx, setPartnerTypeIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleApply = () => {
    let pos = '';
    
    // 男のタイプが選ばれた場合、最先頭にガッチャンコ
    if (partnerOn) {
      pos += PARTNER_TYPES[partnerTypeIdx].pos;
    }
    
    if (race) pos += race;
    if (age) pos += age;
    if (physique) pos += physique;
    if (angle) pos += angle;

    let neg = '';
    if (partnerOn) {
      neg = PARTNER_NEG_ON_BASE + PARTNER_TYPES[partnerTypeIdx].neg;
    } else {
      neg = PARTNER_NEG_OFF;
    }

    onApply(pos, neg, targetText);
    // setIsOpen(false); removed to keep it open
  };

  const handleReset = () => {
    setRace('');
    setAge('');
    setPhysique('');
    setAngle('');
    setPartnerOn(false);
    onApply('', '', targetText); // If targetText is set, it will replace targetText with empty string, which acts as delete.
  };

  const isMono = theme === 'mono';
  const btnClass = isMono 
    ? 'bg-gray-900 hover:bg-black text-white border border-gray-700' 
    : 'bg-blue-600 hover:bg-blue-500 text-white';

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={\`flex items-center justify-center w-full gap-1 px-3 py-2 rounded text-[13px] font-mono font-bold transition-colors shadow-sm \${btnClass}\`}
      >
        <User className="w-3.5 h-3.5" /> 属性設定ミキサー
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[350px] bg-bg-surface border border-border-main rounded-lg shadow-xl z-50 p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border-main pb-2">
            <span className="font-bold text-[14px] text-text-main font-mono">👤 属性設定ミキサー</span>
            <button onClick={() => setIsOpen(false)} className="text-text-dim hover:text-text-main">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 border-b border-border-main pb-3 mb-1">
            <label className="text-[13px] font-bold text-text-main font-mono">🔍 置換対象のキーワード (手動)</label>
            <input 
              type="text" 
              placeholder="例: japanese woman (空なら先頭挿入)"
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

          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border-main">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="partner-check" 
                checked={partnerOn}
                onChange={e => setPartnerOn(e.target.checked)}
                className="rounded border-border-main bg-bg-input text-blue-500 focus:ring-blue-500 w-4 h-4"
              />
              <label htmlFor="partner-check" className="text-[14px] font-bold text-text-main font-mono cursor-pointer">
                パートナー(男)出現 (ペアモード)
              </label>
            </div>
            
            {partnerOn && (
              <div className="flex flex-col gap-1.5 pl-6 mt-1">
                <label className="text-[13px] text-text-dim font-mono">男のタイプ</label>
                <select 
                  value={partnerTypeIdx} 
                  onChange={e => setPartnerTypeIdx(Number(e.target.value))} 
                  className="bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main"
                >
                  {PARTNER_TYPES.map((o, i) => <option key={o.label} value={i}>{o.label}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1 rounded py-2.5 text-[13px] font-bold font-mono transition-colors border border-border-main hover:bg-bg-input text-text-main"
            >
              ↩️ リセット
            </button>
            <button 
              onClick={handleApply}
              className={\`flex-[2] flex items-center justify-center gap-1 rounded py-2.5 text-[13px] font-bold font-mono transition-colors \${btnClass}\`}
            >
              <Check className="w-4 h-4" /> 適用 (上書き/挿入)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('src/components/AttributeMixer.tsx', attributeMixerContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleMixAttributes = useCallback\([\s\S]*?\}, \[setEditorText, setNegativeEditorText\]\);/;

const safeFn = `const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    setEditorText(prev => {
      let result = prev;
      
      if (targetToReplace && result.includes(targetToReplace)) {
        // 置換対象のテキストが含まれている場合は、それを丸ごと posStr に置換
        result = result.replace(targetToReplace, posStr);
      } else {
        // 含まれていない、もしくは空の場合は先頭に挿入
        if (posStr) {
          result = posStr + (result.length > 0 && !posStr.endsWith(' ') ? ' ' : '') + result;
        }
      }
      
      // 余分なカンマや先頭のカンマをクリーンアップ
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });

    setNegativeEditorText(prev => {
      let result = prev;
      
      // 既存のネガティブ（パートナー関連）の削除処理は維持
      for (const known of ALL_KNOWN_NEG_STRINGS) {
        if (!known) continue;
        const coreKnown = known.replace(/,\\s*$/, '');
        result = result.split(known).join('');
        result = result.split(coreKnown).join('');
      }
      
      if (negStr) {
        result = negStr + (result.length > 0 && !negStr.endsWith(' ') ? ' ' : '') + result;
      }
      
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });
  }, [setEditorText, setNegativeEditorText]);`;

appContent = appContent.replace(regex, safeFn);
fs.writeFileSync('src/App.tsx', appContent);

console.log("Updated mixer logic completely");
