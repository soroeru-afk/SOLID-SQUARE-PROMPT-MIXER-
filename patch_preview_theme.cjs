const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /const isLight = paperMode \|\| theme === 'light' \|\| theme === 'paper';/g,
  "const isLight = paperMode || theme === 'light' || theme === 'paper' || theme === 'mono';"
);

code = code.replace(
  /theme === 'light'/g,
  "(theme === 'light' || theme === 'mono')"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn theme checks");
