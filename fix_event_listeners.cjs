const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /window\.addEventListener\('attributeMixerDataImported', \(\) => loadCats\(true\)\);\n\s*\/\/ Add custom event listener for local updates\n\s*window\.addEventListener\('mixer_presets_updated', \(\) => loadCats\(true\)\);\n\s*return \(\) => \{\n\s*window\.removeEventListener\('attributeMixerDataImported', \(\) => loadCats\(true\)\);\n\s*window\.removeEventListener\('mixer_presets_updated', \(\) => loadCats\(true\)\);/;

const replacement = `const handleCatsUpdate = () => loadCats(true);
    window.addEventListener('attributeMixerDataImported', handleCatsUpdate);
    window.addEventListener('mixer_presets_updated', handleCatsUpdate);
    return () => {
      window.removeEventListener('attributeMixerDataImported', handleCatsUpdate);
      window.removeEventListener('mixer_presets_updated', handleCatsUpdate);`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('event listeners patched');
} else {
  console.log('event listeners regex not found');
}
