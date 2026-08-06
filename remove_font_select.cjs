const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Remove state
content = content.replace(/const \[editorFontFamily, setEditorFontFamily\] = useState\(\(\) => \{\s*return localStorage\.getItem\('editorFontFamily'\) \|\| 'font-mono';\s*\}\);\s*useEffect\(\(\) => \{\s*localStorage\.setItem\('editorFontFamily', editorFontFamily\);\s*\}, \[editorFontFamily\]\);/g, '');

// Remove select
content = content.replace(/<select\s*value=\{editorFontFamily\}[\s\S]*?<\/select>/g, '');

// Replace variable in classNames
content = content.replace(/\$\{editorFontFamily\}/g, 'font-mono');

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Removed font family selection and forced font-mono');
