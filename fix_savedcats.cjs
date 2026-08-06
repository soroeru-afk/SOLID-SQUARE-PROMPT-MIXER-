const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const regex = /const savedCats = localStorage\.getItem\('attribute_mixer_categories_v2'\);\n\s*if \(savedCats\) \{\n\s*try \{ setCategories\(JSON\.parse\(savedCats\)\); \} catch \(e\) \{\}\n\s*\}/;
content = content.replace(regex, '');

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
