const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const regex = /const handleImported = \(\) => \{\n\s*const savedPresets = localStorage\.getItem\('attribute_mixer_custom_presets_v7'\)/;
const replacement = `const handleImported = () => {
      const savedCats = localStorage.getItem('attribute_mixer_categories_v2');
      if (savedCats) {
        try { setCategories(JSON.parse(savedCats)); } catch (e) {}
      }
      const savedPresets = localStorage.getItem('attribute_mixer_custom_presets_v7')`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/AttributeMixer.tsx', content);
  console.log('handleImported patched in AttributeMixer.tsx');
} else {
  console.log('Regex not found!');
}
