const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

content = content.replace(
  /        <span className="text-\[10px\] font-mono text-text-main opacity-50 ml-2">\{t\('font_weight', lang as Language\)\}:<\/span>\n/,
  ""
);

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Fixed preview column');
