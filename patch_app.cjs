const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /localStorage\.setItem\('attribute_mixer_custom_presets_v6'/g,
  "localStorage.setItem('attribute_mixer_custom_presets_v7'"
);

content = content.replace(
  /const presetsStr = localStorage\.getItem\('attribute_mixer_custom_presets_v6'\);/g,
  "const presetsStr = localStorage.getItem('attribute_mixer_custom_presets_v7') || localStorage.getItem('attribute_mixer_custom_presets_v6');"
);

fs.writeFileSync('src/App.tsx', content);
