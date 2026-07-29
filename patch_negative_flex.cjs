const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const negContainerRegex = /<div \n\s*className=\{`border border-border-main rounded-lg flex flex-col shrink-0 relative transition-colors \$\{paperMode \? 'bg-\[\#f4f4f5\] border-gray-300 shadow-inner' : 'bg-bg-base'\}`\}\n\s*style=\{\{ height: isNegativeOpen \? `\$\{negativeHeight\}px` : 'auto' \}\}\n\s*>/;

if (code.match(negContainerRegex)) {
  code = code.replace(negContainerRegex, `<div \n          className={\`\${!isPositiveOpen && isNegativeOpen ? 'flex-1 min-h-[100px]' : 'shrink-0'} border border-border-main rounded-lg flex flex-col relative transition-colors \${paperMode ? 'bg-[#f4f4f5] border-gray-300 shadow-inner' : 'bg-bg-base'}\`}\n          style={{ height: (!isPositiveOpen && isNegativeOpen) ? 'auto' : (isNegativeOpen ? \`\${negativeHeight}px\` : 'auto') }}\n        >`);
  console.log("Patched negative container");
} else {
  console.log("Could not find negative container");
}

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
