const fs = require('fs');

const code = `import React, { useState } from 'react';
import { User, X, Check } from 'lucide-react';

export const RACE_OPTIONS = [
  { label: 'None', value: '' },
  { label: 'Japanese', value: 'japanese girl, (fair pale skin texture:1.3), ' },
  { label: 'British', value: 'british girl, (creamy white skin, elegant sharp facial features:1.3), ' },
  { label: 'Russian', value: 'russian girl, (pinkish white skin, soft light pink details:1.3), ' },
  { label: 'Brazilian', value: 'brazilian girl, (toned tan olive skin texture, dark sharp details:1.3), ' },
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
  const [targetText, setTargetText] = useState('');
  const [race, setRace] = useState(RACE_OPTIONS[0].value);
  const [age, setAge] = useState(AGE_OPTIONS[0].value);
  const [physique, setPhysique] = useState(PHYSIQUE_OPTIONS[0].value);
  const [angle, setAngle] = useState(ANGLE_OPTIONS[0].value);
  const [partnerOn, setPartnerOn] = useState(false);
  const [partnerTypeIdx, setPartnerTypeIdx] = useState(0);

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
  };

  const handleReset = () => {
    setRace('');
    setAge('');
    setPhysique('');
    setAngle('');
    setPartnerOn(false);
    onApply('', '', targetText); // If targetText is set, it will replace targetText with empty string, which acts as delete.
  };

  return (
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
};
`;

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
console.log("Properly rewritten AttributeMixer.tsx");
