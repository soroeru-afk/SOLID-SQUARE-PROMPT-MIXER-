const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

content = content.replace(/break-all/g, 'break-words');

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Reverted break-all to break-words');
