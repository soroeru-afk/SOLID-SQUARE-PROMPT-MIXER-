const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(
  /\$\{\(theme === 'mono'\) \? 'bg-bg-input hover:bg-gray-500 hover:text-white' : 'bg-bg-input hover:bg-border-main'\} rounded-full text-text-dim hover:text-text-main/g,
  "${theme === 'mono' ? 'bg-bg-input hover:bg-gray-500 hover:text-white' : 'bg-bg-input hover:bg-border-main hover:text-text-main'} rounded-full text-text-dim"
);
// wait the first group might not have parenthesis around theme === 'mono'
code = code.replace(
  /\$\{theme === 'mono' \? 'bg-bg-input hover:bg-gray-500 hover:text-white' : 'bg-bg-input hover:bg-border-main'\} rounded-full text-text-dim hover:text-text-main/g,
  "${theme === 'mono' ? 'bg-bg-input hover:bg-gray-500 hover:text-white' : 'bg-bg-input hover:bg-border-main hover:text-text-main'} rounded-full text-text-dim"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched text overrides");
