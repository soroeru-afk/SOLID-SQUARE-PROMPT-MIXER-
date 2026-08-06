const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// Modify the initial state of categories
const newCategoriesInit = `const [categories, setCategories] = useState<CategoryDef[]>(() => {
    let finalCats = [...DEFAULT_CATEGORIES];
    const saved = localStorage.getItem('attribute_mixer_categories_v2') || localStorage.getItem('attribute_mixer_categories_v1') || localStorage.getItem('attribute_mixer_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Merge missing defaults (like genderAndPeople) at the beginning if they are missing
          const existingIds = new Set(parsed.map(c => c.id));
          const missingDefaults = DEFAULT_CATEGORIES.filter(c => !existingIds.has(c.id));
          finalCats = [...missingDefaults, ...parsed];
        }
      } catch(e) {}
    }
    return finalCats;
  });`;

content = content.replace(/const \[categories, setCategories\] = useState<CategoryDef\[\]>\(\(\) => \{[\s\S]*?return finalCats;\s*\}\);/, newCategoriesInit);

// And update the load handler for imported data
const newLoadImport = `const savedCats = localStorage.getItem('attribute_mixer_categories_v2') || localStorage.getItem('attribute_mixer_categories_v1') || localStorage.getItem('attribute_mixer_categories');
      if (savedCats) {
        try {
          const parsed = JSON.parse(savedCats);
          if (Array.isArray(parsed)) {
            const existingIds = new Set(parsed.map((c: any) => c.id));
            const missingDefaults = DEFAULT_CATEGORIES.filter(c => !existingIds.has(c.id));
            setCategories([...missingDefaults, ...parsed]);
          }
        } catch(e) {}
      }`;

content = content.replace(/const savedCats = localStorage\.getItem\('attribute_mixer_categories_v2'\)[\s\S]*?catch\(e\) \{\}/, newLoadImport);


// Also presets need migration to include DEFAULT_PRESETS if missing
const newPresetsInit = `const [presets, setPresets] = useState<Presets>(() => {
    let finalPresets = { ...DEFAULT_PRESETS };
    const saved = localStorage.getItem('attribute_mixer_custom_presets_v7') || localStorage.getItem('attribute_mixer_custom_presets_v6') || localStorage.getItem('attribute_mixer_custom_presets_v5') || localStorage.getItem('attribute_mixer_custom_presets_v4') || localStorage.getItem('attribute_mixer_custom_presets_v3') || localStorage.getItem('attribute_mixer_custom_presets_v2') || localStorage.getItem('attribute_mixer_custom_presets_v1') || localStorage.getItem('attribute_mixer_custom_presets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        finalPresets = { ...DEFAULT_PRESETS, ...parsed }; // Ensure new defaults are merged
      } catch(e) {}
    }
    return finalPresets;
  });`;

content = content.replace(/const \[presets, setPresets\] = useState<Presets>\(\(\) => \{[\s\S]*?return finalPresets;\s*\}\);/, newPresetsInit);

// Import presets update
const newPresetsLoad = `const savedPresetsStr = localStorage.getItem('attribute_mixer_custom_presets_v7') || localStorage.getItem('attribute_mixer_custom_presets_v6') || localStorage.getItem('attribute_mixer_custom_presets_v5') || localStorage.getItem('attribute_mixer_custom_presets_v4') || localStorage.getItem('attribute_mixer_custom_presets_v3') || localStorage.getItem('attribute_mixer_custom_presets_v2') || localStorage.getItem('attribute_mixer_custom_presets_v1') || localStorage.getItem('attribute_mixer_custom_presets');
      if (savedPresetsStr) {
        try {
          const parsed = JSON.parse(savedPresetsStr);
          setPresets({ ...DEFAULT_PRESETS, ...parsed });
        } catch(e) {}
      }`;

content = content.replace(/const savedPresetsStr = localStorage\.getItem\('attribute_mixer_custom_presets_v7'\)[\s\S]*?catch\(e\) \{\}/, newPresetsLoad);


fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('Fixed migration logic in AttributeMixer');
