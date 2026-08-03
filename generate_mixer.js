const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. Types & DEFAULT_PRESETS
content = content.replace(/type Presets = \{[\s\S]*?\};/, `type Presets = Record<string, PresetItem[]>;
type CategoryDef = {
  id: string;
  label: string;
  isNegative?: boolean;
};
`);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
