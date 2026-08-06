const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

content = content.replace(
  'const [categories, setCategories] = useState<CategoryDef[]>([...DEFAULT_CATEGORIES]);',
  `const [categories, setCategories] = useState<CategoryDef[]>(() => {
    let finalCats = [...DEFAULT_CATEGORIES];
    const saved = localStorage.getItem('attribute_mixer_categories_v2') || localStorage.getItem('attribute_mixer_categories_v1') || localStorage.getItem('attribute_mixer_categories');
    if (saved) {
      try {
        finalCats = JSON.parse(saved);
      } catch(e) {}
    }
    return finalCats;
  });`
);

content = content.replace(
  'const [presets, setPresets] = useState<Presets>({ ...DEFAULT_PRESETS });',
  `const [presets, setPresets] = useState<Presets>(() => {
    let finalPresets = { ...DEFAULT_PRESETS };
    const saved = localStorage.getItem('attribute_mixer_custom_presets_v7') || localStorage.getItem('attribute_mixer_custom_presets_v6') || localStorage.getItem('attribute_mixer_custom_presets_v5') || localStorage.getItem('attribute_mixer_custom_presets_v4') || localStorage.getItem('attribute_mixer_custom_presets_v3') || localStorage.getItem('attribute_mixer_custom_presets_v2') || localStorage.getItem('attribute_mixer_custom_presets_v1') || localStorage.getItem('attribute_mixer_custom_presets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const result = { ...parsed };
        for (const key of Object.keys(DEFAULT_PRESETS)) {
          if (!result[key]) {
            result[key] = DEFAULT_PRESETS[key];
          }
        }
        if (parsed.location) result.location = parsed.location;
        finalPresets = result;
      } catch (e) {}
    }
    return finalPresets;
  });`
);

content = content.replace(
  'const [combinations, setCombinations] = useState<Combination[]>([]);',
  `const [combinations, setCombinations] = useState<Combination[]>(() => {
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
  });`
);

content = content.replace(
  'const [selections, setSelections] = useState<Record<string, number>>(Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.id, 0])));',
  `const [selections, setSelections] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('attribute_mixer_selections_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.id, 0]));
  });`
);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
