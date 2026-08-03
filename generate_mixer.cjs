const fs = require('fs');

const initialCategories = [
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
  { id: 'partner', label: '男 (Partner)' },
  { id: 'neg_default', label: 'ネガティブ基本', isNegative: true }
];

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// replace types
content = content.replace(/type Presets = \{[\s\S]*?\};/, `type Presets = Record<string, PresetItem[]>;
export type CategoryDef = {
  id: string;
  label: string;
  isNegative?: boolean;
};`);

// replace Combination type
content = content.replace(/type Combination = \{[\s\S]*?\};/, `type Combination = {
  id: string;
  name: string;
  selections: Record<string, number>;
  negativePrompt: string;
};`);

// add missing imports
if (!content.includes('GripVertical')) {
  content = content.replace(/import \{ Check, /, "import { Check, GripVertical, ChevronsUp, ChevronsDown, ");
}

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
