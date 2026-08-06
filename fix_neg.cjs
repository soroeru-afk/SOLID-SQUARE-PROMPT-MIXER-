const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const lines = content.split('\n');
const textareaIndex = lines.findIndex((l, i) => i > 1800 && l.includes('<textarea'));

const overlay = `            <div 
              ref={negativeHighlightRef}
              className={\`absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none pointer-events-none font-mono \${paperMode ? 'text-gray-800' : 'text-text-dim'}\`}
              style={{ fontSize: \`\${editorFontSize}px\`, lineHeight: editorLineHeight, fontWeight: editorFontWeight }}
              aria-hidden="true"
            >
              {negativeEditorText ? <>{renderHighlightedText(negativeEditorText)}{negativeEditorText.endsWith('\\n') ? '\\u200B' : ''}</> : <span className="opacity-50">Negative prompt...</span>}
            </div>
            <textarea`;

if (textareaIndex !== -1) {
  lines[textareaIndex] = overlay;
  fs.writeFileSync('src/components/PreviewColumn.tsx', lines.join('\n'));
  console.log('Fixed neg!');
} else {
  console.log('Not found');
}
