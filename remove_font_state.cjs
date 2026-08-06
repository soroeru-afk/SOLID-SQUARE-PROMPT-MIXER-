const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// The state looks like this:
/*
  const [editorFontFamily, setEditorFontFamily] = useState(() => {
    return localStorage.getItem('editorFontFamily') || 'font-mono';
  });
...
  useEffect(() => {
    localStorage.setItem('editorFontFamily', editorFontFamily);
  }, [editorFontFamily]);
*/

const stateRegex = /const \[editorFontFamily, setEditorFontFamily\] = useState\(\(\) => \{\s*return localStorage\.getItem\('editorFontFamily'\) \|\| 'font-mono';\s*\}\);/;
content = content.replace(stateRegex, '');

const effectRegex = /useEffect\(\(\) => \{\s*localStorage\.setItem\('editorFontFamily', editorFontFamily\);\s*\}, \[editorFontFamily\]\);/;
content = content.replace(effectRegex, '');

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Removed font family state');
