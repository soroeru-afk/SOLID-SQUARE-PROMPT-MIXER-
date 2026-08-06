const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

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

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Restored neg highlights');
