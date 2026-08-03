import React, { useState, useEffect } from 'react';
import { Check, Settings2, Plus, Trash2, Save, ChevronDown, ChevronUp, ChevronsUp, ChevronsDown, Edit2, RotateCcw, GripVertical } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { Language, t } from '../i18n';

type PresetItem = { label: string; value: string };
type Presets = Record<string, PresetItem[]>;
export type CategoryDef = {
  id: string;
  label: string;
  isNegative?: boolean;
};

type Combination = {
  id: string;
  name: string;
  selections: Record<string, number>;
  negativePrompt: string;
};

const DEFAULT_CATEGORIES: CategoryDef[] = [
  { id: 'race', label: '人種 (Race)' },
  { id: 'age', label: '年齢 (Age)' },
  { id: 'physique', label: '体型 (Physique)' },
  { id: 'pose', label: '体位・ポーズ (Pose)' },
  { id: 'characteristics', label: '特徴・個性 (Characteristics)' },
  { id: 'expression', label: '表情・気持ち (Expression)' },
  { id: 'clothing', label: '衣類・コスチューム (Clothing)' },
  { id: 'hair', label: 'ヘア・髪型 (Hair)' },
  { id: 'bodyHair', label: 'アンダーヘア・脇毛 (Body Hair)' },
  { id: 'accessories', label: 'アクセサリー (Accessories)' },
  { id: 'angle', label: 'アングル (Angle)' },
  { id: 'location', label: '場所・背景 (Location)' },
  { id: 'situation', label: 'シチュエーション・状況 (Situation)' },
  { id: 'freeText1', label: '自由・フリー設定 1 (Free Text 1)' },
  { id: 'freeText2', label: '自由・フリー設定 2 (Free Text 2)' },
  { id: 'partner', label: '男 (Partner)' }
];

const DEFAULT_PRESETS: Presets = {
  race: [
    { label: '指定なし / None', value: '' },
    { label: '日本人 / Japanese', value: '1japanese woman, ' },
    { label: 'ロシア人 / Russian', value: '1russian woman, white skin, ' },
    { label: 'イギリス人 / British', value: '1british woman, ' },
    { label: 'アメリカ人 / American', value: '1american woman, ' },
    { label: 'ドイツ人 / German', value: '1german woman, ' },
    { label: '白人 / Caucasian', value: '1caucasian woman, ' },
    { label: '黒人 / Black', value: '1dark skin woman, ' },
    { label: 'ラテン系 / Latina', value: '1latina woman, ' }
  ],
  age: [
    { label: '指定なし / None', value: '' },
    { label: '大人の女性 / Adult', value: 'adult woman, mature female, ' },
    { label: '熟女 / Mature', value: 'mature woman, milf, ' },
    { label: '人妻 / MILF', value: 'milf, mature woman, ' },
    { label: '老人 / Old Woman', value: 'old woman, aged, wrinkles, ' },
    { label: '若い女性 / Young Woman', value: 'young woman, youth, ' },
    { label: '10代 / Teen', value: 'teenager, teen girl, ' },
    { label: '女子高生 / High School Girl', value: 'high school girl, school uniform, ' }
  ],
  physique: [
    { label: '指定なし / None', value: '' },
    { label: 'スリム・美しい体型 / Slender', value: 'slender body, slim, ' },
    { label: 'ガチ重量級 / Heavyweight', value: 'heavyweight, colossal female, thick, fat, ' },
    { label: '筋肉質 / Muscular', value: 'muscular female, abs, ' },
    { label: 'カーヴィー(安産型) / Curvy', value: 'curvy, wide hips, thick thighs, ' },
    { label: '小柄・貧乳 / Petite', value: 'petite, small breasts, short, ' }
  ],
  pose: [
    { label: '指定なし / None', value: '' },
    { label: '直立姿勢 / Standing', value: 'standing, ' },
    { label: '座った姿勢 / Sitting', value: 'sitting, ' },
    { label: '蹲踞の姿勢 / Squatting', value: 'squatting, ' },
    { label: '両腕を上げた姿勢 / Arms Raised', value: 'arms up, hands up, ' }
  ],
  characteristics: [
    { label: '指定なし / None', value: '' },
    { label: '照れ・赤面 / Shy & Blushing', value: 'shy, blushing, ' },
    { label: '自信満々・ドヤ顔 / Confident & Smug', value: 'confident, smug, smiling, ' },
    { label: 'ヤンデレ / Yandere', value: 'yandere, empty eyes, dark aura, ' },
    { label: 'ツンデレ / Tsundere', value: 'tsundere, glaring, ' },
    { label: '眠そう / Sleepy', value: 'sleepy, rubbing eyes, ' },
    { label: '巨乳 / Huge Breasts', value: 'huge breasts, large breasts, ' },
    { label: '絶壁 / Flat Chest', value: 'flat chest, small breasts, ' },
    { label: '巨尻 / Big Butt', value: 'huge butt, wide hips, ' },
    { label: '太い腕 / Thick Arms', value: 'thick arms, ' }
  ],
  expression: [
    { label: '指定なし / None', value: '' },
    { label: '笑顔 / Smile', value: 'smile, happy, ' },
    { label: '泣き顔 / Crying', value: 'crying, tears, sad, ' },
    { label: '怒り顔 / Angry', value: 'angry, glaring, ' },
    { label: 'アヘ顔 / Ahegao', value: 'ahegao, rolled eyes, tongue out, ' },
    { label: '口を開けた顔 / Open Mouth', value: 'open mouth, ' }
  ],
  clothing: [
    { label: '指定なし / None', value: '' },
    { label: '全裸 / Nude', value: 'nude, naked, completely nude, ' },
    { label: 'ビキニ / Bikini', value: 'bikini, swimsuit, ' },
    { label: 'ランジェリー / Lingerie', value: 'lingerie, bra, panties, ' },
    { label: '私服 / Casual', value: 'casual wear, t-shirt, jeans, ' }
  ],
  hair: [
    { label: '指定なし / None', value: '' },
    { label: 'ショート / Short Hair', value: 'short hair, ' },
    { label: 'ロング / Long Hair', value: 'long hair, ' },
    { label: 'ボブ / Bob Cut', value: 'bob cut, ' },
    { label: 'ポニーテール / Ponytail', value: 'ponytail, ' },
    { label: 'ツインテール / Twintails', value: 'twintails, ' },
    { label: '束ねた髪型 / Low Chignon', value: 'low chignon hairstyle, ' },
    { label: '寝癖・ボサボサ / Messy Hair', value: 'messy hair, bedhead, ' },
    { label: '金髪 / Blonde', value: 'blonde hair, ' },
    { label: '黒髪 / Black Hair', value: 'black hair, ' },
    { label: '茶髪 / Brown Hair', value: 'brown hair, ' },
    { label: 'ピンク髪 / Pink Hair', value: 'pink hair, ' }
  ],
  bodyHair: [
    { label: '指定なし / None', value: '' },
    { label: 'アンダーヘアあり / Pubic Hair', value: 'pubic hair, ' },
    { label: 'わき毛あり / Armpit Hair', value: 'armpit hair, ' },
    { label: 'ツルツル / Hairless', value: 'hairless, shaved, ' }
  ],
  accessories: [
    { label: '指定なし / None', value: '' },
    { label: '眼鏡 / Glasses', value: 'glasses, megane, ' },
    { label: 'チョーカー / Choker', value: 'choker, ' },
    { label: 'ピアス / Piercings', value: 'piercings, earrings, ' },
    { label: 'タトゥー / Tattoos', value: 'tattoos, body art, ' }
  ],
  angle: [
    { label: '指定なし / None', value: '' },
    { label: '正面 / Front View', value: 'front view, facing viewer, ' },
    { label: '横顔 / Side View', value: 'side view, profile, ' },
    { label: '後ろ姿 / Back View', value: 'back view, from behind, ' },
    { label: '俯瞰(上から) / High Angle', value: 'high angle, from above, ' },
    { label: 'アオリ(下から) / Low Angle', value: 'low angle, from below, ' }
  ],
  location: [
    { label: '指定なし / None', value: '' },
    { label: '屋内・部屋 / Indoors', value: 'indoors, bedroom, ' },
    { label: '屋外・街中 / Outdoors', value: 'outdoors, street, ' },
    { label: '海・ビーチ / Beach', value: 'beach, ocean, ' },
    { label: '学校・教室 / School', value: 'school, classroom, ' },
    { label: 'オフィス / Office', value: 'office, workplace, ' },
    { label: '自然・森 / Nature', value: 'nature, forest, ' }
  ],
  situation: [
    { label: '指定なし / None', value: '' },
    { label: '自撮り / Selfie', value: 'selfie, holding phone, ' },
    { label: '見つめ合う / Eye Contact', value: 'looking at viewer, eye contact, ' },
    { label: '食事中 / Eating', value: 'eating, holding food, ' },
    { label: '運動中 / Exercising', value: 'exercising, sweat, ' },
    { label: '戦闘中 / Fighting', value: 'fighting, action pose, ' }
  ],
  partner: [
    { label: '指定なし / None', value: '' },
    { label: '見えない男 / Faceless Male', value: '1other, faceless male, anonymous male, ' },
    { label: 'オーク / Orc', value: '1other, orc, monster, ' },
    { label: '触手 / Tentacles', value: 'tentacles, alien, monster, ' }
  ],
  freeText1: [
    { label: '指定なし / None', value: '' },
    { label: '高品質 / Masterpiece', value: 'masterpiece, best quality, ultra-detailed, ' },
    { label: 'リアル / Realistic', value: 'realistic, photorealistic, 8k, raw photo, ' }
  ],
  freeText2: [
    { label: '指定なし / None', value: '' },
    { label: 'シネマティック / Cinematic', value: 'cinematic lighting, dramatic lighting, ' },
    { label: 'アニメ風 / Anime Style', value: 'anime artwork, illustration, flat color, ' }
  ]
};

interface AttributeMixerProps {
  onApply: (pos: string, neg: string, target?: string) => void;
  theme?: string;
  lang?: Language;
}

export const AttributeMixer: React.FC<AttributeMixerProps> = ({ onApply, theme = 'default', lang = 'ja' as Language }) => {
  
  
  const [categories, setCategories] = useState<CategoryDef[]>(() => {
    let finalCats = [...DEFAULT_CATEGORIES];
    const keys = ['attribute_mixer_categories_v2', 'attribute_mixer_categories_v1', 'attribute_mixer_categories'];
    for (const k of keys) {
      try {
        const saved = localStorage.getItem(k);
        if (saved) {
          const parsed = JSON.parse(saved);
          const map = new Map();
          parsed.forEach((c: any) => map.set(c.id, c));
          finalCats.forEach(c => {
            if (!map.has(c.id)) {
              map.set(c.id, c);
            }
          });
          finalCats = Array.from(map.values());
          break; // only load the latest available
        }
      } catch (e) {}
    }
    return finalCats;
  });
  useEffect(() => {
    localStorage.setItem('attribute_mixer_categories_v2', JSON.stringify(categories));
  }, [categories]);

  const [presets, setPresets] = useState<Presets>(() => {
    const mergePresets = (target: any, source: any) => {
      if (!source) return target;
      const result = { ...target };
      for (const key of Object.keys(source)) {
        if (!result[key]) {
          result[key] = source[key];
        } else if (Array.isArray(result[key]) && Array.isArray(source[key])) {
          const map = new Map();
          result[key].forEach((item: any) => {
            map.set(item.label, item);
          });
          source[key].forEach((item: any) => {
            const clean = item.label;
            const existing = map.get(clean);
            if (existing) {
              map.set(clean, { label: item.label, value: item.value });
            } else {
              // Also check if value matches to prevent duplicates if only label changed
              const existingByVal = Array.from(map.entries()).find(([k, v]) => v.value === item.value && item.value !== '');
              if (existingByVal) {
                map.delete(existingByVal[0]);
                map.set(clean, item);
              } else {
                map.set(clean, item);
              }
            }
          });
          result[key] = Array.from(map.values());
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };

    let finalPresets = { ...DEFAULT_PRESETS };
    const keys = [
      'attribute_mixer_custom_presets_v7',
      'attribute_mixer_custom_presets_v6',
      'attribute_mixer_custom_presets_v5',
      'attribute_mixer_custom_presets_v4',
      'attribute_mixer_custom_presets_v3',
      'attribute_mixer_custom_presets_v2',
      'attribute_mixer_custom_presets_v1',
      'attribute_mixer_custom_presets'
    ];
    
    for (const k of keys) {
      try {
        const saved = localStorage.getItem(k);
        if (saved) {
          const parsed = JSON.parse(saved);
          finalPresets = mergePresets(finalPresets, parsed);
          break; // only load the latest available
        }
      } catch (e) {}
    }

    if (finalPresets.race) {
      finalPresets.race = finalPresets.race.map(r => ({ ...r, value: r.value.replace(/1(japanese|russian|british|american|german|caucasian|dark skin|latina) girl/g, '1$1 woman') }));
    }

    // Ensure index 0 is always '指定なし / None'
    for (const catKey of Object.keys(finalPresets)) {
      const arr = finalPresets[catKey];
      if (arr && arr.length > 0) {
        if (arr[0].label !== '指定なし / None' || arr[0].value !== '') {
          const filtered = arr.filter(a => a.label !== '指定なし / None' || a.value !== '');
          finalPresets[catKey] = [{ label: '指定なし / None', value: '' }, ...filtered];
        }
      } else {
        finalPresets[catKey] = [{ label: '指定なし / None', value: '' }];
      }
    }
    return finalPresets;
  });
  useEffect(() => {
    localStorage.setItem('attribute_mixer_custom_presets_v7', JSON.stringify(presets));
  }, [presets]);

  const [combinations, setCombinations] = useState<Combination[]>(() => {
    let finalCombos: Combination[] = [];
    const keys = ['attribute_mixer_combinations_v1', 'attribute_mixer_combinations'];
    for (const k of keys) {
      try {
        const saved = localStorage.getItem(k);
        if (saved) {
          const parsed = JSON.parse(saved);
          const map = new Map();
          finalCombos.forEach(c => map.set(c.id, c));
          parsed.forEach((c: any) => map.set(c.id, c));
          finalCombos = Array.from(map.values());
          break; // only load the latest available
        }
      } catch (e) {}
    }
    return finalCombos;
  });
  useEffect(() => {
    localStorage.setItem('attribute_mixer_combinations_v1', JSON.stringify(combinations));
  }, [combinations]);

  const [selections, setSelections] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('attribute_mixer_selections_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.id, 0]));
  });
  useEffect(() => {
    localStorage.setItem('attribute_mixer_selections_v1', JSON.stringify(selections));
  }, [selections]);

  useEffect(() => {
    const handleImported = () => {
      const savedPresets = localStorage.getItem('attribute_mixer_custom_presets_v7') || localStorage.getItem('attribute_mixer_custom_presets_v6') || localStorage.getItem('attribute_mixer_custom_presets_v5') || localStorage.getItem('attribute_mixer_custom_presets_v4') || localStorage.getItem('attribute_mixer_custom_presets_v3') || localStorage.getItem('attribute_mixer_custom_presets_v2') || localStorage.getItem('attribute_mixer_custom_presets_v1') || localStorage.getItem('attribute_mixer_custom_presets');
      if (savedPresets) {
        try {
          const parsed = JSON.parse(savedPresets);
          setPresets({ ...DEFAULT_PRESETS, ...parsed, location: parsed.location || DEFAULT_PRESETS.location });
        } catch (e) {}
      }
      const savedCombos = localStorage.getItem('attribute_mixer_combinations_v1');
      if (savedCombos) {
        try {
          setCombinations(JSON.parse(savedCombos));
        } catch (e) {}
      }
      const savedCats = localStorage.getItem('attribute_mixer_categories_v2') || localStorage.getItem('attribute_mixer_categories_v1') || localStorage.getItem('attribute_mixer_categories');
      if (savedCats) {
        try {
          setCategories(JSON.parse(savedCats));
        } catch(e) {}
      }
    };
    window.addEventListener('attributeMixerDataImported', handleImported);
    return () => window.removeEventListener('attributeMixerDataImported', handleImported);
  }, []);

  const [editModes, setEditModes] = useState<Record<string, boolean>>({});
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<{ category: string; index: number } | null>(null);
  const [dragEnabledItemId, setDragEnabledItemId] = useState<{ category: string; index: number } | null>(null);
  const [dragEnabledCatId, setDragEnabledCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState<string | null>(null);

  const [activeCombinationId, setActiveCombinationId] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isSavedListOpen, setIsSavedListOpen] = useState(false);
  const [editingCombId, setEditingCombId] = useState<string | null>(null);
  const [editingCombName, setEditingCombName] = useState<string>('');

  const [negativePrompt, setNegativePrompt] = useState('');
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);
  const [confirmDeleteCombId, setConfirmDeleteCombId] = useState<string | null>(null);
  const [confirmResetState, setConfirmResetState] = useState(false);
  const [confirmResetToDefaultState, setConfirmResetToDefaultState] = useState(false);

  const saveCurrentCombination = () => {
    const defaultName = `カスタム設定 ${combinations.length + 1}`;
    
    const newComb: Combination = {
      id: `comb_${Date.now()}`,
      name: defaultName,
      selections: { ...selections },
      negativePrompt
    };
    
    setCombinations(prev => [...prev, newComb]);
    setActiveCombinationId(newComb.id);
    
    setIsSavedListOpen(true);
    setEditingCombId(newComb.id);
    setEditingCombName(defaultName);
    
    setSaveSuccessMessage(lang === 'en' ? 'Saved as new!' : '新規保存しました！ (Saved!)');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const loadCombination = (id: string) => {
    const comb = combinations.find(c => c.id === id);
    if (comb) {
      const safeSelections = { ...Object.fromEntries(categories.map(c => [c.id, 0])), ...comb.selections };
      setSelections(safeSelections);
      setNegativePrompt(comb.negativePrompt || '');
      setActiveCombinationId(id);
      
      setSaveSuccessMessage(lang === 'en' ? 'Loaded!' : '読み込みました！ (Loaded!)');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  const updateCombination = () => {
    if (!activeCombinationId) return;
    setCombinations(prev => prev.map(c => 
      c.id === activeCombinationId ? { ...c, selections: { ...selections }, negativePrompt } : c
    ));
    setSaveSuccessMessage(lang === 'en' ? 'Updated!' : '上書き保存しました！ (Updated!)');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const deleteCombination = (id: string) => {
    setCombinations(prev => prev.filter(c => c.id !== id));
    if (activeCombinationId === id) setActiveCombinationId('');
  };

  const startEditingCombination = (id: string, currentName: string) => {
    setEditingCombId(id);
    setEditingCombName(currentName);
  };

  const saveEditedCombination = (id: string) => {
    if (editingCombName.trim()) {
      setCombinations(prev => prev.map(c => 
        c.id === id ? { ...c, name: editingCombName.trim() } : c
      ));
    }
    setEditingCombId(null);
  };

  const handleApply = () => {
    const posParts: string[] = [];
    const negParts: string[] = [];
    
    categories.forEach(cat => {
      const val = (presets[cat.id] || DEFAULT_PRESETS[cat.id] || [])[selections[cat.id] || 0]?.value || '';
      if (val) {
        if (cat.isNegative) {
          negParts.push(val);
        } else {
          posParts.push(val);
        }
      }
    });

    const pos = posParts.join('');
    const neg = negParts.join('');
    onApply(pos, negativePrompt + (negativePrompt && neg ? ', ' : '') + neg, '');
  };

  const handleReset = () => {
    setConfirmResetState(true);
  };

  const updatePresetItem = (category: string, index: number, field: 'label' | 'value', newValue: string) => {
    if (index === 0) return;
    setPresets(prev => {
      const newCategory = [...(prev[category] || [])];
      newCategory[index] = { ...newCategory[index], [field]: newValue };
      return { ...prev, [category]: newCategory };
    });
  };

  const addPresetItem = (category: string) => {
    setPresets(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), { label: 'New Item', value: '' }]
    }));
    setEditModes(prev => ({ ...prev, [category]: true }));
  };

  const removePresetItem = (category: string, index: number) => {
    if (index === 0) return;
    setPresets(prev => {
      const newCategory = [...(prev[category] || [])];
      newCategory.splice(index, 1);
      return { ...prev, [category]: newCategory };
    });
    
    if (selections[category] === index) {
      setSelections(prev => ({ ...prev, [category]: 0 }));
    } else if (selections[category] > index) {
      setSelections(prev => ({ ...prev, [category]: prev[category] - 1 }));
    }
  };

  const moveCategory = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const newCats = [...prev];
      const [item] = newCats.splice(idx, 1);
      if (direction === 'up') newCats.splice(Math.max(0, idx - 1), 0, item);
      else if (direction === 'down') newCats.splice(Math.min(newCats.length, idx + 1), 0, item);
      else if (direction === 'top') newCats.unshift(item);
      else if (direction === 'bottom') newCats.push(item);
      return newCats;
    });
  };

  
  const handleItemDragStart = (e: React.DragEvent, category: string, index: number) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItemId({ category, index });
    e.dataTransfer.setData('text/plain', `item:${category}:${index}`);
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleItemDrop = (e: React.DragEvent, targetCategory: string, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemId || draggedItemId.category !== targetCategory) {
      setDraggedItemId(null);
      return;
    }
    const draggedIdx = draggedItemId.index;
    if (draggedIdx === targetIndex || draggedIdx === 0 || targetIndex === 0) {
      setDraggedItemId(null);
      return;
    }

    setPresets(prev => {
      const newCategory = [...(prev[targetCategory] || [])];
      const [item] = newCategory.splice(draggedIdx, 1);
      newCategory.splice(targetIndex, 0, item);
      return { ...prev, [targetCategory]: newCategory };
    });

    setSelections(prev => {
      const currentSel = prev[targetCategory] || 0;
      let newSel = currentSel;
      
      if (currentSel === draggedIdx) {
        newSel = targetIndex;
      } else if (currentSel > draggedIdx && currentSel <= targetIndex) {
        newSel = currentSel - 1;
      } else if (currentSel < draggedIdx && currentSel >= targetIndex) {
        newSel = currentSel + 1;
      }
      return { ...prev, [targetCategory]: newSel };
    });
    setDraggedItemId(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCatId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedCatId || draggedCatId === targetId) return;
    setCategories(prev => {
      const draggedIdx = prev.findIndex(c => c.id === draggedCatId);
      const targetIdx = prev.findIndex(c => c.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;
      if (!!prev[draggedIdx].isNegative !== !!prev[targetIdx].isNegative) return prev;
      const newCats = [...prev];
      const [item] = newCats.splice(draggedIdx, 1);
      newCats.splice(targetIdx, 0, item);
      return newCats;
    });
    setDraggedCatId(null);
  };

  const renderCategory = (cat: CategoryDef, index: number) => {
    const key = cat.id;
    const items = presets[key] || DEFAULT_PRESETS[key] || [{ label: '指定なし / None', value: '' }];
    const currentIdx = selections[key] ?? 0;
    const isEditing = editModes[key] || false;
    const isRenaming = editingCatName === key;

    return (
      <div 
        className={`flex flex-col gap-1.5 p-2 rounded border border-border-main bg-bg-surface transition-colors min-w-0 ${draggedCatId === key ? 'opacity-50' : 'hover:bg-bg-panel/30'}`}
        key={key}
        draggable={!isRenaming && !isEditing && dragEnabledCatId === key}
        onDragStart={(e) => {
          if (isRenaming || isEditing) { e.preventDefault(); e.stopPropagation(); return; }
          handleDragStart(e, key);
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, key)}
      >
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <div className="cursor-grab active:cursor-grabbing p-1 text-text-main hover:text-blue-500 transition-opacity" onMouseEnter={() => setDragEnabledCatId(key)} onMouseLeave={() => setDragEnabledCatId(null)}>
              <GripVertical className="w-3 h-3" />
            </div>
            {isRenaming ? (
              <input 
                autoFocus
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="bg-bg-input border border-border-main rounded px-2 py-0.5 text-[13px] text-text-main font-mono w-full"
                defaultValue={cat.label}
                onBlur={(e) => {
                  const newLabel = e.target.value.trim();
                  if (newLabel) setCategories(prev => prev.map(c => c.id === key ? { ...c, label: newLabel } : c));
                  setEditingCatName(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newLabel = e.currentTarget.value.trim();
                    if (newLabel) setCategories(prev => prev.map(c => c.id === key ? { ...c, label: newLabel } : c));
                    setEditingCatName(null);
                  } else if (e.key === 'Escape') {
                    setEditingCatName(null);
                  }
                }}
              />
            ) : (
              <label 
                className="text-[13px] text-text-main font-mono cursor-pointer hover:text-blue-500 truncate"
                onDoubleClick={() => setEditingCatName(key)}
                title="ダブルクリックで名前を変更"
              >
                {cat.isNegative && "⛔ "}{cat.label}
              </label>
            )}
          </div>
          
          <div className="flex items-center gap-1 transition-opacity mr-2">
            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); moveCategory(key, 'top'); }} className="p-0.5 text-text-main hover:text-blue-500" title="一番上へ"><ChevronsUp className="w-3 h-3" /></button>
            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); moveCategory(key, 'bottom'); }} className="p-0.5 text-text-main hover:text-blue-500" title="一番下へ"><ChevronsDown className="w-3 h-3" /></button>
            {!DEFAULT_CATEGORIES.some(c => c.id === key) && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (confirmDeleteCatId === key) {
                    setCategories(prev => prev.filter(c => c.id !== key));
                    setPresets(prev => { const n = {...prev}; delete n[key]; return n; });
                    setConfirmDeleteCatId(null);
                  } else {
                    setConfirmDeleteCatId(key);
                    setTimeout(() => setConfirmDeleteCatId(null), 3000);
                  }
                }}
                className={`p-0.5 ml-1 transition-colors ${confirmDeleteCatId === key ? 'text-red-500 bg-red-500/20 rounded' : 'text-red-500 hover:text-red-400'}`}
                title={confirmDeleteCatId === key ? "クリックして削除" : "削除"}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setEditModes(prev => ({ ...prev, [key]: !prev[key] }))}
            className={`w-[64px] justify-center px-2 py-0.5 rounded text-[10px] font-bold transition-colors shrink-0 flex items-center gap-1 border ${
              isEditing 
                ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600' 
                : 'bg-bg-surface hover:bg-bg-input text-text-main border-border-main'
            }`}
          >
            {isEditing ? (
              <><Check className="w-2.5 h-2.5" /> 適用</>
            ) : (
              <><Settings2 className="w-2.5 h-2.5" /> 編集</>
            )}
          </button>
        </div>
        
        {isEditing ? (
          <div className="flex flex-col gap-2 p-2 border border-blue-500/30 rounded bg-blue-500/5">
            {items.map((item, idx) => idx === 0 && items.length > 1 ? null : (
              <div 
                key={idx} 
                className={`flex gap-1 items-start ${draggedItemId?.category === key && draggedItemId?.index === idx ? 'opacity-50' : ''}`}
                draggable={idx !== 0 && dragEnabledItemId?.category === key && dragEnabledItemId?.index === idx}
                onDragStart={(e) => {
                  if (idx !== 0) handleItemDragStart(e, key, idx);
                }}
                onDragOver={handleItemDragOver}
                onDrop={(e) => handleItemDrop(e, key, idx)}
              >
                {idx !== 0 ? (
                  <div className="cursor-grab active:cursor-grabbing pt-1.5 text-text-dim hover:text-text-main transition-opacity" onMouseEnter={() => setDragEnabledItemId({ category: key, index: idx })} onMouseLeave={() => setDragEnabledItemId(null)}>
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-[14px] shrink-0" />
                )}
                <div className="flex flex-col gap-1 flex-1">
                  <input 
                    value={item.label}
                    onChange={(e) => updatePresetItem(key, idx, 'label', e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className={`w-full bg-bg-input border border-border-main rounded px-2 py-1 text-[11px] ${idx === 0 ? 'text-text-dim cursor-not-allowed opacity-70' : 'text-text-main'}`} disabled={idx === 0}
                    placeholder="項目名 (例: Russian)"
                  />
                  <textarea 
                    value={item.value}
                    onChange={(e) => updatePresetItem(key, idx, 'value', e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className={`w-full bg-bg-surface border border-border-main rounded px-2 py-1 text-[11px] font-mono h-[40px] resize-y min-h-[40px] ${idx === 0 ? 'text-text-dim cursor-not-allowed opacity-70' : 'text-text-main'}`} disabled={idx === 0}
                    placeholder="プロンプト (例: 1russian girl, )"
                  />
                </div>
                {(idx !== 0 || (cat.isNegative && items.length > 1)) && (
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
          <div className="flex gap-2 items-start pl-4 w-full min-w-0">
            <select 
              value={currentIdx} 
              onChange={e => setSelections(prev => ({ ...prev, [key]: Number(e.target.value) }))} 
              className="flex-1 min-w-0 bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main truncate"
            >
              {items.map((o, idx) => <option key={idx} value={idx}>{o.label}</option>)}
            </select>
          </div>
        )}
      </div>
    );
  };

  const handleResetToDefault = () => {
    setConfirmResetToDefaultState(true);
  };
  
  const performResetToDefault = () => {
      setCategories([...DEFAULT_CATEGORIES]);
      setPresets({ ...DEFAULT_PRESETS });
      setCombinations([]);
      setSelections(Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.id, 0])));
      setNegativePrompt('');
      localStorage.removeItem('attribute_mixer_categories_v2');
      localStorage.removeItem('attribute_mixer_categories_v1');
      localStorage.removeItem('attribute_mixer_categories');
      localStorage.removeItem('attribute_mixer_custom_presets_v7');
      localStorage.removeItem('attribute_mixer_custom_presets_v6');
      localStorage.removeItem('attribute_mixer_custom_presets_v5');
      localStorage.removeItem('attribute_mixer_custom_presets_v4');
      localStorage.removeItem('attribute_mixer_custom_presets_v3');
      localStorage.removeItem('attribute_mixer_custom_presets_v2');
      localStorage.removeItem('attribute_mixer_custom_presets_v1');
      localStorage.removeItem('attribute_mixer_custom_presets');
      localStorage.removeItem('attribute_mixer_combinations_v1');
      localStorage.removeItem('attribute_mixer_combinations');
      localStorage.removeItem('attribute_mixer_selections_v1');
      setSaveSuccessMessage(lang === 'en' ? 'Initialized' : '初期化しました');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  return (    <div className="w-full flex flex-col gap-4 p-4">
      <ConfirmModal
        isOpen={confirmResetState}
        message={t('reset_selection_confirm', lang)}
        onConfirm={() => {
          setSelections(Object.fromEntries(categories.map(c => [c.id, 0])));
          setNegativePrompt('');
          setActiveCombinationId('');
          setConfirmResetState(false);
        }}
        onCancel={() => setConfirmResetState(false)}
        lang={lang}
      />
      <ConfirmModal
        isOpen={confirmResetToDefaultState}
        message={t('reset_mixer_confirm', lang)}
        onConfirm={() => {
          performResetToDefault();
          setConfirmResetToDefaultState(false);
        }}
        onCancel={() => setConfirmResetToDefaultState(false)}
        lang={lang}
      />
      {/* 組み合わせ保存・ロード領域 */}
      <div className="flex flex-col gap-2 p-3 bg-bg-surface border border-border-main rounded mb-2 relative">
        {saveSuccessMessage && (
          <div className="absolute -top-3 right-2 z-50 bg-green-600 text-white shadow-lg border border-green-500 px-3 py-1.5 rounded text-[12px] font-bold animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            {saveSuccessMessage}
          </div>
        )}
                <div className="flex gap-2 items-center">
          <label className="text-[13px] font-bold text-text-main font-mono flex items-center gap-1.5 flex-1">
            <Save className="w-4 h-4 text-blue-500" />
            {t('save_and_load_settings', lang)}
          </label>
          <button
            onClick={handleResetToDefault}
            className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded text-[11px] font-bold transition-colors flex items-center gap-1"
          >
            {t('reset_to_default', lang)}
          </button>
        </div>
        
        <div className="flex gap-2 items-center min-w-0">
          <select 
            onChange={(e) => {
              loadCombination(e.target.value);
            }}
            className="flex-1 min-w-0 bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main font-mono truncate"
            value={activeCombinationId || ""}
          >
            <option value="" disabled>{t('load_saved_settings', lang)}</option>
            {combinations.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {activeCombinationId && (
            <button
              onClick={() => loadCombination(activeCombinationId)}
              className="p-1.5 bg-bg-input hover:bg-border-hover border border-border-main rounded text-text-main hover:text-blue-500 transition-colors shrink-0"
              title="保存状態に戻す (Revert to saved)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-1">
          <button 
            onClick={saveCurrentCombination}
            className="flex-1 py-1.5 bg-bg-input hover:bg-border-hover border border-border-main rounded text-text-main text-[11px] font-bold transition-colors"
          >{t('save_new', lang)}</button>
          {activeCombinationId && (
            <button 
              onClick={updateCombination}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-600 rounded text-[11px] font-bold transition-colors"
            >{t('overwrite_save', lang)}</button>
          )}
        </div>
        
        {combinations.length > 0 && (
          <div className="mt-2 flex flex-col gap-1 border-t border-border-main pt-2">
            <button 
              onClick={() => setIsSavedListOpen(!isSavedListOpen)}
              className="flex items-center justify-between w-full text-[12px] text-text-main hover:text-blue-500 py-1"
            >
              <span>保存済み一覧 ({combinations.length}件)</span>
              {isSavedListOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            
            {isSavedListOpen && (
              <div className="flex flex-col gap-1.5 mt-1 max-h-[220px] overflow-y-auto pr-1">
                {combinations.map(c => (
                  <div key={c.id} className="flex flex-col gap-1.5 bg-bg-input p-2 rounded border border-border-main">
                    <div className="flex items-center justify-between">
                      {editingCombId === c.id ? (
                        <div className="flex items-center gap-1 flex-1 mr-2">
                          <input 
                            type="text" 
                            value={editingCombName}
                            onChange={(e) => setEditingCombName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEditedCombination(c.id); }}
                            className="flex-1 bg-bg-surface border border-blue-500/50 rounded px-1.5 py-0.5 text-[12px] text-text-main font-mono"
                            autoFocus
                          />
                          <button onClick={() => saveEditedCombination(c.id)} className="text-blue-500 p-1 hover:bg-blue-500/10 rounded">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[12px] text-text-main font-bold font-mono truncate flex-1">{c.name}</span>
                      )}
                      
                      <div className="flex items-center gap-1 shrink-0">
                        {editingCombId !== c.id && (
                          <button 
                            onClick={() => startEditingCombination(c.id, c.name)}
                            className="text-text-main hover:text-blue-500 p-1 rounded transition-colors"
                            title="名前を変更"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirmDeleteCombId === c.id) {
                              deleteCombination(c.id);
                              setConfirmDeleteCombId(null);
                            } else {
                              setConfirmDeleteCombId(c.id);
                              setTimeout(() => setConfirmDeleteCombId(null), 3000);
                            }
                          }}
                          className={`p-1 rounded transition-colors ${confirmDeleteCombId === c.id ? 'text-red-500 bg-red-500/20' : 'text-red-500/70 hover:text-red-500 hover:bg-red-500/10'}`}
                          title={confirmDeleteCombId === c.id ? "クリックして削除" : "削除"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => loadCombination(c.id)}
                      className="w-full text-center py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded text-[11px] font-bold transition-colors"
                    >
                      この設定を呼び出す
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      

      <div className="flex flex-col gap-2">
        {categories.map((c, i) => !c.isNegative && renderCategory(c, i))}
      </div>
      
      <div className="flex gap-2 justify-end mt-2">
        <button
          onClick={() => {
            const id = 'custom_' + Date.now();
            setCategories(prev => [...prev, { id, label: '新規カテゴリ' }]);
            setPresets(prev => ({ ...prev, [id]: [{ label: '指定なし / None', value: '' }] }));
          }}
          className="px-2 py-1 bg-bg-surface hover:bg-bg-input border border-border-main rounded text-[11px] font-bold flex items-center gap-1 transition-colors text-text-main"
        >
          <Plus className="w-3 h-3" /> カテゴリ追加
        </button>
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-border-main mt-2">
        <div className="flex flex-col gap-2 mb-2">
          {categories.map((c, i) => c.isNegative && renderCategory(c, i))}
        </div>
        <label className="text-[13px] font-bold text-text-main font-mono mt-2">⛔ ネガティブプロンプト (自由入力)</label>
        <textarea 
          value={negativePrompt}
          onChange={e => setNegativePrompt(e.target.value)}
          placeholder="ネガティブプロンプトを追加..."
          className="w-full bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main font-mono min-h-[60px] resize-y"
        />
        <button
          onClick={() => {
            const id = 'custom_neg_' + Date.now();
            setCategories(prev => [...prev, { id, label: '新規ネガティブ', isNegative: true }]);
            setPresets(prev => ({ ...prev, [id]: [{ label: '指定なし / None', value: '' }] }));
          }}
          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-[11px] font-bold flex items-center gap-1 transition-colors text-red-400 self-end mt-1"
        >
          <Plus className="w-3 h-3" /> ネガティブ追加
        </button>
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
