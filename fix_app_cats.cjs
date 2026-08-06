const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /let finalCats = \[\n\s*\{ id: 'race', label: '人種 \(Race\)' \},/,
  "let finalCats = [\n        { id: 'genderAndPeople', label: '性別と人数 (Gender & People)' },\n        { id: 'race', label: '人種 (Race)' },"
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed App categories');
