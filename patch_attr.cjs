const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. Update Presets type
code = code.replace(
  /type Presets = \{[\s\S]*?partner: PresetItem\[\];\n\};/,
  `type Presets = {
  race: PresetItem[];
  age: PresetItem[];
  physique: PresetItem[];
  angle: PresetItem[];
  location: PresetItem[];
  partner: PresetItem[];
};`
);

// 2. Update DEFAULT_PRESETS
code = code.replace(
  /partner: \[\n    \{ label: 'None', value: '' \},/,
  `location: [
    { label: 'None', value: '' },
    { label: '学校', value: 'school, classroom, ' },
    { label: 'オフィス', value: 'office, workplace, ' },
    { label: '公園・屋外', value: 'park, outdoors, nature, ' },
    { label: 'ベッドルーム', value: 'bedroom, bed, ' },
    { label: '路地裏・ストリート', value: 'alley, street, city, ' }
  ],
  partner: [
    { label: 'None', value: '' },`
);

// 3. Update selections state initialization
code = code.replace(
  /const \[selections, setSelections\] = useState<Record<string, number>>\(\{\n    race: 0,\n    age: 0,\n    physique: 0,\n    angle: 0,\n    partner: 0\n  \}\);/,
  `const [selections, setSelections] = useState<Record<string, number>>({
    race: 0,
    age: 0,
    physique: 0,
    angle: 0,
    location: 0,
    partner: 0
  });`
);

// 4. Update handleApply parts array
code = code.replace(
  /const parts = \[\n      presets\.partner\[selections\.partner\]\?\.value \|\| '',\n      presets\.race\[selections\.race\]\?\.value \|\| '',\n      presets\.age\[selections\.age\]\?\.value \|\| '',\n      presets\.physique\[selections\.physique\]\?\.value \|\| '',\n      presets\.angle\[selections\.angle\]\?\.value \|\| ''\n    \]\.filter\(Boolean\);/,
  `const parts = [
      presets.partner[selections.partner]?.value || '',
      presets.race[selections.race]?.value || '',
      presets.age[selections.age]?.value || '',
      presets.physique[selections.physique]?.value || '',
      presets.angle[selections.angle]?.value || '',
      presets.location[selections.location]?.value || ''
    ].filter(Boolean);`
);

// 5. Update handleReset
code = code.replace(
  /setSelections\(\{\n      race: 0,\n      age: 0,\n      physique: 0,\n      angle: 0,\n      partner: 0\n    \}\);/,
  `setSelections({
      race: 0,
      age: 0,
      physique: 0,
      angle: 0,
      location: 0,
      partner: 0
    });`
);

// 6. Add renderCategory for location
code = code.replace(
  /\{renderCategory\('angle', 'アングル \(Angle\)'\)\}/,
  `{renderCategory('angle', 'アングル (Angle)')}
      {renderCategory('location', '場所・背景 (Location)')}`
);

// Add missing DEFAULT_PRESETS merge logic if new fields are missing from localstorage
code = code.replace(
  /return JSON\.parse\(saved\);/,
  `const parsed = JSON.parse(saved);
        return { ...DEFAULT_PRESETS, ...parsed, location: parsed.location || DEFAULT_PRESETS.location };`
);


fs.writeFileSync('src/components/AttributeMixer.tsx', code);
