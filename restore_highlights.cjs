const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const posDiv = `            <div 
              ref={positiveHighlightRef}
              className={\`absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none pointer-events-none font-mono \${paperMode ? 'text-gray-800' : 'text-text-dim'}\`}
              style={{ fontSize: \`\${editorFontSize}px\`, lineHeight: editorLineHeight, fontWeight: editorFontWeight }}
              aria-hidden="true"
            >
              {editorText ? <>{renderHighlightedText(editorText)}{editorText.endsWith('\\n') ? '\\u200B' : ''}</> : <span className="opacity-50">{t('placeholder', lang)}</span>}
            </div>
            <textarea`;

content = content.replace(/<textarea/, posDiv);

const negDiv = `            <div 
              ref={negativeHighlightRef}
              className={\`absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none pointer-events-none font-mono \${paperMode ? 'text-gray-800' : 'text-text-dim'}\`}
              style={{ fontSize: \`\${editorFontSize}px\`, lineHeight: editorLineHeight, fontWeight: editorFontWeight }}
              aria-hidden="true"
            >
              {negativeEditorText ? <>{renderHighlightedText(negativeEditorText)}{negativeEditorText.endsWith('\\n') ? '\\u200B' : ''}</> : <span className="opacity-50">Negative prompt...</span>}
            </div>
            <textarea`;

content = content.replace(/<textarea([^>]*ref=\{negativeTextRef\})/g, negDiv + '$1');

// Add back onScroll and fix classes for positive textarea
content = content.replace(
  /onSelect=\{\(e\) => \{\s*setActiveEditor\('positive'\);\s*setPositiveCursorPos\(e\.currentTarget\.selectionStart\);\s*\}\}/,
  `onSelect={(e) => {
                setActiveEditor('positive');
                setPositiveCursorPos(e.currentTarget.selectionStart);
              }}
              onScroll={(e) => {
                if (positiveHighlightRef.current) {
                  positiveHighlightRef.current.scrollTop = e.currentTarget.scrollTop;
                  positiveHighlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}`
);

content = content.replace(
  /className=\{\`absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none font-mono \$\{paperMode \? 'text-gray-800' : 'text-text-main'\} bg-transparent outline-none resize-none placeholder:opacity-50\`\}\s*placeholder=\{t\('placeholder', lang\)\}/,
  `className={\`absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none font-mono selection:bg-blue-500/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`}`
);

// Add back onScroll and fix classes for negative textarea
content = content.replace(
  /onSelect=\{\(e\) => \{\s*setActiveEditor\('negative'\);\s*setNegativeCursorPos\(e\.currentTarget\.selectionStart\);\s*\}\}/,
  `onSelect={(e) => {
                setActiveEditor('negative');
                setNegativeCursorPos(e.currentTarget.selectionStart);
              }}
              onScroll={(e) => {
                if (negativeHighlightRef.current) {
                  negativeHighlightRef.current.scrollTop = e.currentTarget.scrollTop;
                  negativeHighlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}`
);

content = content.replace(
  /className=\{\`absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none font-mono \$\{paperMode \? 'text-gray-800' : 'text-text-main'\} bg-transparent outline-none resize-none placeholder:opacity-50\`\}\s*placeholder="Negative prompt..."/,
  `className={\`absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none font-mono selection:bg-red-500/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`}`
);


fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Restored highlights');
