const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Replace the positive block
const positiveBlockRegex = /<div\s+ref=\{positiveHighlightRef\}[\s\S]*?<\/div>\s*<textarea/g;
content = content.replace(positiveBlockRegex, '<textarea');

// Replace the negative block
const negativeBlockRegex = /<div\s+ref=\{negativeHighlightRef\}[\s\S]*?<\/div>\s*<textarea/g;
content = content.replace(negativeBlockRegex, '<textarea');

// Now fix the textarea classes to make them visible and standard
// The current textarea class looks like:
// className={\`... font-mono selection:bg-blue-500/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`}
content = content.replace(
  /className=\{\`([^\`]+)font-mono selection:bg-blue-500\/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`\}/g,
  `className={\`$1font-mono \${paperMode ? 'text-gray-800' : 'text-text-main'} bg-transparent outline-none resize-none placeholder:opacity-50\`}\n              placeholder={t('placeholder', lang)}`
);

content = content.replace(
  /className=\{\`([^\`]+)font-mono selection:bg-red-500\/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`\}/g,
  `className={\`$1font-mono \${paperMode ? 'text-gray-800' : 'text-text-main'} bg-transparent outline-none resize-none placeholder:opacity-50\`}\n              placeholder="Negative prompt..."`
);

// We can also safely remove the onScroll handlers since there is no highlight ref anymore
content = content.replace(
  /onScroll=\{\(e\) => \{\s*if \(positiveHighlightRef\.current\) \{\s*positiveHighlightRef\.current\.scrollTop = e\.currentTarget\.scrollTop;\s*positiveHighlightRef\.current\.scrollLeft = e\.currentTarget\.scrollLeft;\s*\}\s*\}\}/g,
  ''
);

content = content.replace(
  /onScroll=\{\(e\) => \{\s*if \(negativeHighlightRef\.current\) \{\s*negativeHighlightRef\.current\.scrollTop = e\.currentTarget\.scrollTop;\s*negativeHighlightRef\.current\.scrollLeft = e\.currentTarget\.scrollLeft;\s*\}\s*\}\}/g,
  ''
);

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Simplified textareas');
