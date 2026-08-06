const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// Insert into DEFAULT_CATEGORIES
content = content.replace(
  /const DEFAULT_CATEGORIES: CategoryDef\[\] = \[/,
  "const DEFAULT_CATEGORIES: CategoryDef[] = [\n  { id: 'genderAndPeople', label: '性別と人数 (Gender & People)' },"
);

// Insert into DEFAULT_PRESETS
content = content.replace(
  /const DEFAULT_PRESETS: Presets = \{/,
  `const DEFAULT_PRESETS: Presets = {
  genderAndPeople: [
    { label: '指定なし / None', value: '' },
    { label: '女性のみ (Female only)', value: '1girl, solo, ' },
    { label: '男性のみ (Male only)', value: '1boy, solo, ' },
    { label: '男女ペア (Male and Female pair)', value: '1girl, 1boy, couple, ' },
    { label: '女性複数 (Multiple females)', value: 'multiple girls, ' },
    { label: '男性複数 (Multiple males)', value: 'multiple boys, ' }
  ],`
);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('Fixed categories and presets');
