import React, { useState, useEffect } from 'react';
import { Check, Settings2, Plus, Trash2 } from 'lucide-react';
import { Language } from '../i18n';

type PresetItem = { label: string; value: string };
type Presets = {
  race: PresetItem[];
  age: PresetItem[];
  physique: PresetItem[];
  angle: PresetItem[];
  location: PresetItem[];
  partner: PresetItem[];
};

const DEFAULT_PRESETS: Presets = {
  race: [
    { label: 'None', value: '' },
    { label: 'Japanese 🌟', value: '1japanese girl, ' },
    { label: 'Russian 🌟', value: '1russian girl, white skin, ' },
    { label: 'British', value: '1british girl, ' },
    { label: 'American', value: '1american girl, ' },
    { label: 'German', value: '1german girl, ' },
    { label: 'Caucasian', value: '1caucasian girl, ' },
    { label: 'Black', value: '1dark skin girl, ' },
    { label: 'Latina', value: '1latina girl, ' }
  ],
  age: [
    { label: 'None', value: '' },
    { label: 'Adult 🌟', value: 'adult woman, mature female, ' },
    { label: 'Mature 🌟', value: 'mature woman, milf, ' },
    { label: 'MILF', value: 'milf, mature woman, ' },
    { label: 'Old Woman', value: 'old woman, aged, wrinkles, ' },
    { label: 'Young Woman 🌟', value: 'young woman, youth, ' },
    { label: 'Teen', value: 'teenager, teen girl, ' },
    { label: 'High School Girl 🌟', value: 'high school girl, school uniform, ' }
  ],
  physique: [
    { label: 'None', value: '' },
    { label: 'スリム・美しい体型 🌟', value: 'slender body, slim, ' },
    { label: 'ガチ重量級', value: 'heavyweight, colossal female, thick, fat, ' },
    { label: 'Large', value: 'large body, fat, ' }
  ],
  angle: [
    { label: 'None', value: '' },
    { label: '全身ショット 🌟', value: 'full body shot, full length, ' },
    { label: '腰から上（ミディアム） 🌟', value: 'medium shot, waist up, ' },
    { label: '斜めアングル', value: 'three-quarter view, ' },
    { label: '完全真横寝', value: 'lying on side, full body, ' },
    { label: 'ローアングル', value: 'low angle, from below, ' }
  ],
  location: [
    { label: 'None', value: '' },
    { label: '学校', value: 'school, classroom, ' },
    { label: 'オフィス', value: 'office, workplace, ' },
    { label: '公園・屋外', value: 'park, outdoors, nature, ' },
    { label: 'ベッドルーム', value: 'bedroom, bed, ' },
    { label: '路地裏・ストリート', value: 'alley, street, city, ' }
  ],
  partner: [
    { label: 'None', value: '' },
    { label: '日本のじいさん', value: '1old japanese man, ' },
    { label: '普通の男子高校生', value: '1japanese high school boy, ' },
    { label: '178cm筋肉質男性', value: '1muscular man, ' }
  ]
};

interface AttributeMixerProps {
  onApply: (pos: string, neg: string, target?: string) => void;
  theme?: string;
  lang?: Language;
}

export const AttributeMixer: React.FC<AttributeMixerProps> = ({ onApply, theme = 'default', lang = 'ja' }) => {
  const [targetText, setTargetText] = useState('');
  
  const [presets, setPresets] = useState<Presets>(() => {
    const saved = localStorage.getItem('attribute_mixer_custom_presets_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PRESETS, ...parsed, location: parsed.location || DEFAULT_PRESETS.location };
      } catch (e) {}
    }
    return DEFAULT_PRESETS;
  });

  useEffect(() => {
    localStorage.setItem('attribute_mixer_custom_presets_v2', JSON.stringify(presets));
  }, [presets]);

  const [selections, setSelections] = useState<Record<string, number>>({
    race: 0,
    age: 0,
    physique: 0,
    angle: 0,
    location: 0,
    partner: 0
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const handleApply = () => {
    const parts = [
      presets.partner[selections.partner]?.value || '',
      presets.race[selections.race]?.value || '',
      presets.age[selections.age]?.value || '',
      presets.physique[selections.physique]?.value || '',
      presets.angle[selections.angle]?.value || '',
      presets.location[selections.location]?.value || ''
    ].filter(Boolean);

    const pos = parts.join('');
    onApply(pos, '', targetText);
  };

  const handleReset = () => {
    setSelections({
      race: 0,
      age: 0,
      physique: 0,
      angle: 0,
      location: 0,
      partner: 0
    });
    setTargetText('');
  };

  const updatePresetItem = (category: keyof Presets, index: number, field: 'label' | 'value', newValue: string) => {
    setPresets(prev => {
      const newCategory = [...prev[category]];
      newCategory[index] = { ...newCategory[index], [field]: newValue };
      return { ...prev, [category]: newCategory };
    });
  };

  const addPresetItem = (category: keyof Presets) => {
    setPresets(prev => ({
      ...prev,
      [category]: [...prev[category], { label: 'New Item', value: '' }]
    }));
  };

  const removePresetItem = (category: keyof Presets, index: number) => {
    if (index === 0) return; // 'None' は消せない
    setPresets(prev => {
      const newCategory = [...prev[category]];
      newCategory.splice(index, 1);
      return { ...prev, [category]: newCategory };
    });
    
    // 選択状態を補正
    if (selections[category] === index) {
      setSelections(prev => ({ ...prev, [category]: 0 }));
    } else if (selections[category] > index) {
      setSelections(prev => ({ ...prev, [category]: prev[category] - 1 }));
    }
  };

  const renderCategory = (key: keyof Presets, label: string) => {
    const items = presets[key] || DEFAULT_PRESETS[key];
    const currentIdx = selections[key] ?? 0;

    return (
      <div className="flex flex-col gap-1.5" key={key}>
        <label className="text-[13px] text-text-dim font-mono">{label}</label>
        
        {isEditMode ? (
          <div className="flex flex-col gap-2 p-2 border border-blue-500/30 rounded bg-blue-500/5">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-1 items-start">
                <div className="flex flex-col gap-1 flex-1">
                  <input 
                    value={item.label}
                    onChange={(e) => updatePresetItem(key, idx, 'label', e.target.value)}
                    className="w-full bg-bg-input border border-border-main rounded px-2 py-1 text-[11px] text-text-main"
                    placeholder="項目名 (例: Russian)"
                    disabled={idx === 0}
                  />
                  {idx !== 0 && (
                    <textarea 
                      value={item.value}
                      onChange={(e) => updatePresetItem(key, idx, 'value', e.target.value)}
                      className="w-full bg-bg-surface border border-border-main rounded px-2 py-1 text-[11px] text-text-main font-mono h-[40px] resize-none"
                      placeholder="プロンプト (例: 1russian girl, )"
                    />
                  )}
                </div>
                {idx !== 0 && (
                  <button 
                    onClick={() => removePresetItem(key, idx)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded shrink-0"
                    title="削除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button 
              onClick={() => addPresetItem(key)}
              className="flex items-center justify-center gap-1 w-full py-1.5 mt-1 border border-dashed border-blue-500/50 text-blue-500 hover:bg-blue-500/10 rounded text-[11px] transition-colors"
            >
              <Plus className="w-3 h-3" /> 新規項目を追加
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-start">
            <select 
              value={currentIdx} 
              onChange={e => setSelections(prev => ({ ...prev, [key]: Number(e.target.value) }))} 
              className="flex-1 bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main"
            >
              {items.map((o, idx) => <option key={idx} value={idx}>{o.label}</option>)}
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      
      <div className="flex justify-end mb-[-10px]">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
            isEditMode 
              ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' 
              : 'bg-bg-surface text-text-dim hover:bg-bg-input border-border-main'
          }`}
        >
          <Settings2 className="w-3 h-3" />
          {isEditMode ? '編集モード: ON (完了)' : 'プリセット編集'}
        </button>
      </div>

      <div className="flex flex-col gap-1.5 border-b border-border-main pb-3 mb-1 mt-2">
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

      {renderCategory('race', '人種 (Race)')}
      {renderCategory('age', '年齢 (Age)')}
      {renderCategory('physique', '体型 (Physique)')}
      {renderCategory('angle', 'アングル (Angle)')}
      {renderCategory('location', '場所・背景 (Location)')}
      
      <div className="flex flex-col gap-2 pt-2 border-t border-border-main">
        {renderCategory('partner', '男 (Partner)')}
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
