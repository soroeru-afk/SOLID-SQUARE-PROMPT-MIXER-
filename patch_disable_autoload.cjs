const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const dataRegex = /const \[data, setData\] = useState<AppData>\(\(\) => \{[\s\S]*?return \{ memos: \[\], masters: \[\], negatives: \[\], parts: \[\], customCategories: \[\], customSectionNames: \{\} \};\n\s*\}\);/;
appContent = appContent.replace(dataRegex, `const [data, setData] = useState<AppData>({ memos: [], masters: [], negatives: [], parts: [], customCategories: [], customSectionNames: {} });`);

const tabsRegex = /const \[tabs, setTabs\] = useState<\{id: string, name: string, pos: string, neg: string\}\[\]>\(\(\) => \{[\s\S]*?return \[\{ id: 'tab_' \+ Date\.now\(\), name: 'TAB 01', pos: '', neg: '' \}\];\n\s*\}\);/;
appContent = appContent.replace(tabsRegex, `const [tabs, setTabs] = useState<{id: string, name: string, pos: string, neg: string}[]>([{ id: 'tab_' + Date.now(), name: 'TAB 01', pos: '', neg: '' }]);`);

const importDataRegex = /const handleImportedData = useCallback\(\(importedData: any\) => \{[\s\S]*?return \{\s*memos: uniqueMemos,\s*masters: uniqueMasters,\s*negatives: uniqueNegatives,\s*parts: uniqueParts,\s*customCategories: importedData\.customCategories \|\| prev\.customCategories,\s*customSectionNames: importedData\.customSectionNames \|\| prev\.customSectionNames\s*\};\s*\}\);\s*\}, \[\]\);/;
const importDataReplacement = `const handleImportedData = useCallback((importedData: any) => {
    setData({
      memos: importedData.memos || [],
      masters: importedData.masters || [],
      negatives: importedData.negatives || [],
      parts: importedData.parts || [],
      customCategories: importedData.customCategories || [],
      customSectionNames: importedData.customSectionNames || {}
    });
  }, []);`;
appContent = appContent.replace(importDataRegex, importDataReplacement);

fs.writeFileSync('src/App.tsx', appContent);
console.log('App.tsx patched');


// Patch AttributeMixer.tsx
let mixerContent = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const catRegex = /const \[categories, setCategories\] = useState<CategoryDef\[\]>\(\(\) => \{[\s\S]*?return finalCats;\n\s*\}\);/;
mixerContent = mixerContent.replace(catRegex, `const [categories, setCategories] = useState<CategoryDef[]>([...DEFAULT_CATEGORIES]);`);

const presRegex = /const \[presets, setPresets\] = useState<Presets>\(\(\) => \{[\s\S]*?return finalPresets;\n\s*\}\);/;
mixerContent = mixerContent.replace(presRegex, `const [presets, setPresets] = useState<Presets>({ ...DEFAULT_PRESETS });`);

const combRegex = /const \[combinations, setCombinations\] = useState<Combination\[\]>\(\(\) => \{[\s\S]*?return \[\];\n\s*\}\);/;
mixerContent = mixerContent.replace(combRegex, `const [combinations, setCombinations] = useState<Combination[]>([]);`);

const selRegex = /const \[selections, setSelections\] = useState<Record<string, number>>\(\(\) => \{[\s\S]*?return Object\.fromEntries\(DEFAULT_CATEGORIES\.map\(c => \[c\.id, 0\]\)\);\n\s*\}\);/;
mixerContent = mixerContent.replace(selRegex, `const [selections, setSelections] = useState<Record<string, number>>(Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.id, 0])));`);

fs.writeFileSync('src/components/AttributeMixer.tsx', mixerContent);
console.log('AttributeMixer.tsx patched');


// Patch VariationColumn.tsx
let varContent = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const orderRegex = /const \[sectionOrder, setSectionOrder\] = useState<number\[\]>\(\(\) => \{\n\s*const saved = localStorage\.getItem\('variation_section_order'\);\n\s*return saved \? JSON\.parse\(saved\) : \[1, 2, 3, 4\];\n\s*\}\);/;
varContent = varContent.replace(orderRegex, `const [sectionOrder, setSectionOrder] = useState<number[]>([1, 2, 3, 4]);`);

fs.writeFileSync('src/components/VariationColumn.tsx', varContent);
console.log('VariationColumn.tsx patched');

