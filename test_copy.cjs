const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /const existingPartsSet = new Set\(/,
  'console.log("Adding new parts", newParts.length); console.log("Existing parts", prev.parts.length);\n      const existingPartsSet = new Set('
);
content = content.replace(
  /existingPartsSet\.add\(key\);\s*\/\/\s*newParts同士での重複も防ぐ\s*return true;/g,
  'console.log("Adding new:", key);\n        existingPartsSet.add(key);\n        return true;'
);
fs.writeFileSync('src/App.tsx', content);
