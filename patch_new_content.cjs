const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleAddMaster = \(name: string = 'NEW_MASTER', content: string = 'new content', negativeContent\?: string\) => \{/g,
  "const handleAddMaster = (name: string = 'NEW_MASTER', content: string = '', negativeContent?: string) => {"
);

code = code.replace(
  /const handleAddNegative = \(name: string = 'NEW_NEGATIVE', content: string = 'new negative content'\) => \{/g,
  "const handleAddNegative = (name: string = 'NEW_NEGATIVE', content: string = '') => {"
);

code = code.replace(
  /const handleAddPart = \(category: string, section: number, name: string = 'NEW_PART', content: string = 'new content'\) => \{/g,
  "const handleAddPart = (category: string, section: number, name: string = 'NEW_PART', content: string = '') => {"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched default content strings");
