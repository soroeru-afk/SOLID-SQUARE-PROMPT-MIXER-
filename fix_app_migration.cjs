const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newLoadCats = `    const loadCats = (isEvent = false) => {
      let finalCats = [
        { id: 'genderAndPeople', label: '性別と人数 (Gender & People)' },
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
          try { 
            const parsed = JSON.parse(saved); 
            if (Array.isArray(parsed)) {
              const existingIds = new Set(parsed.map((c: any) => c.id));
              const missingDefaults = finalCats.filter(c => !existingIds.has(c.id));
              finalCats = [...missingDefaults, ...parsed];
            }
          } catch(e) {}
        }
      }
      
      setMixerCategories(finalCats);
    };`;

content = content.replace(/const loadCats = \(isEvent = false\) => \{[\s\S]*?setMixerCategories\(finalCats\);\s*\};/, newLoadCats);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed migration logic in App');
