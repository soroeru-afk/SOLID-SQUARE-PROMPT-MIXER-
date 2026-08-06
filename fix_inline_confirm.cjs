const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

content = content.replace(
  /\{lang === 'en' \? 'Copy all\?' : '全コピーしますか\?'\}/g,
  "{lang === 'en' ? 'Copy new items?' : '差分（新規）をコピーしますか?'}"
);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('Fixed inline confirm message');
