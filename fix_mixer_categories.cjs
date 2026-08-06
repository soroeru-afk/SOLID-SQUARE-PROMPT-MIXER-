const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const loadCats = \(\) => \{[\s\S]*?setMixerCategories\(finalCats\);\n\s*\};\n\s*loadCats\(\);/;

const replacement = `const loadCats = (isEvent = false) => {
      let finalCats = [
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
        { id: 'weather', label: '天候 (Weather)' },
        { id: 'emptyLocation', label: '無人の場所 (Empty Location)' },
        { id: 'bodyWet', label: '濡れ表現 (Wet Body)' },
        { id: 'lighting', label: '光の表現 (Lighting)' },
        { id: 'lens', label: 'レンズ・フィルター (Lens/Filter)' },
        { id: 'background', label: '背景 (Background)' },
        { id: 'environment', label: '環境・照明 (Environment/Lighting)' },
        { id: 'artStyle', label: '画風・スタイル (Art Style)' },
        { id: 'camera', label: 'カメラ・アングル (Camera/Angle)' }
      ];
      
      if (isEvent) {
        const saved = localStorage.getItem('attribute_mixer_categories_v2') || localStorage.getItem('attribute_mixer_categories_v1') || localStorage.getItem('attribute_mixer_categories');
        if (saved) {
          try { finalCats = JSON.parse(saved); } catch(e) {}
        }
      }
      
      setMixerCategories(finalCats);
    };
    loadCats();`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('mixerCategories patched');
} else {
  console.log('mixerCategories regex not found');
}

// Also update event listeners to pass true
content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/window\.addEventListener\('attributeMixerDataImported', loadCats\);/, "window.addEventListener('attributeMixerDataImported', () => loadCats(true));");
content = content.replace(/window\.addEventListener\('mixer_presets_updated', loadCats\);/, "window.addEventListener('mixer_presets_updated', () => loadCats(true));");
content = content.replace(/window\.removeEventListener\('attributeMixerDataImported', loadCats\);/, "window.removeEventListener('attributeMixerDataImported', () => loadCats(true));");
content = content.replace(/window\.removeEventListener\('mixer_presets_updated', loadCats\);/, "window.removeEventListener('mixer_presets_updated', () => loadCats(true));");
fs.writeFileSync('src/App.tsx', content);

