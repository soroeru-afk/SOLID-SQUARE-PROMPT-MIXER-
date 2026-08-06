const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Add state
const stateToAdd = `
  const [editorFontWeight, setEditorFontWeight] = useState(() => {
    return localStorage.getItem('editorFontWeight') || '400';
  });

  useEffect(() => {
    localStorage.setItem('editorFontWeight', editorFontWeight);
  }, [editorFontWeight]);
`;

// Insert after editorLineHeight effect
content = content.replace(
  /useEffect\(\(\) => \{\s*localStorage\.setItem\('editorLineHeight', editorLineHeight\.toString\(\)\);\s*\}, \[editorLineHeight\]\);/,
  `useEffect(() => {\n    localStorage.setItem('editorLineHeight', editorLineHeight.toString());\n  }, [editorLineHeight]);\n${stateToAdd}`
);

// Add to UI
const uiToAdd = `
        <div className="flex items-center space-x-1 ml-2">
          <select 
            value={editorFontWeight}
            onChange={e => setEditorFontWeight(e.target.value)}
            className={\`border border-border-main text-[10px] font-mono rounded px-1 py-1 outline-none cursor-pointer uppercase tracking-wider transition-colors shrink-0 \${theme === 'mono' ? 'bg-bg-input text-text-main hover:bg-gray-500 hover:text-white' : 'bg-bg-input text-text-main hover:bg-border-main'}\`}
          >
            <option value="400">Normal</option>
            <option value="700">Bold</option>
            <option value="900">Black</option>
          </select>
        </div>
`;

content = content.replace(
  /<\/button>\s*<\/div>\s*<button\s*onClick=\{/m,
  `</button>\n        </div>${uiToAdd}\n        \n        <button \n          onClick={`
);

// Add to styles
content = content.replace(
  /style=\{\{ fontSize: \`\$\{editorFontSize\}px\`, lineHeight: editorLineHeight \}\}/g,
  `style={{ fontSize: \`\${editorFontSize}px\`, lineHeight: editorLineHeight, fontWeight: editorFontWeight }}`
);

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Added font weight control');
