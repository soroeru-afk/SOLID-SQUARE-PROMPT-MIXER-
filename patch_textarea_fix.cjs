const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Positive highlight div
code = code.replace(
  /className=\{`absolute inset-0 p-4 pt-2 leading-relaxed whitespace-pre-wrap break-words overflow-auto pointer-events-none \$\{editorFontFamily\} \$\{paperMode \? 'text-gray-800' : 'text-text-dim'\}\`\}/,
  "className={`absolute inset-0 p-4 pt-2 leading-relaxed whitespace-pre-wrap break-words overflow-hidden pointer-events-none ${editorFontFamily} ${paperMode ? 'text-gray-800' : 'text-text-dim'}`}"
);

// Positive highlight content with trailing newline handling
code = code.replace(
  /\{editorText \? renderHighlightedText\(editorText\) : <span className="opacity-50">\{t\('placeholder', lang\)\}<\/span>\}/,
  "{editorText ? <>{renderHighlightedText(editorText)}{editorText.endsWith('\\n') ? ' ' : ''}</> : <span className=\"opacity-50\">{t('placeholder', lang)}</span>}"
);

// Positive textarea
code = code.replace(
  /className=\{`absolute inset-0 w-full h-full p-4 pt-2 \$\{editorFontFamily\} leading-relaxed overflow-y-auto whitespace-pre-wrap selection:bg-blue-500\/30 selection:text-text-main bg-transparent text-transparent caret-text-main outline-none resize-none\`\}/,
  "className={`absolute inset-0 w-full h-full p-4 pt-2 ${editorFontFamily} leading-relaxed overflow-y-auto whitespace-pre-wrap break-words selection:bg-blue-500/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none`}"
);

// Negative highlight div
code = code.replace(
  /className=\{`absolute inset-0 p-4 pt-2 leading-relaxed whitespace-pre-wrap break-words overflow-auto pointer-events-none \$\{editorFontFamily\} \$\{paperMode \? 'text-gray-800' : 'text-text-dim'\}\`\}/,
  "className={`absolute inset-0 p-4 pt-2 leading-relaxed whitespace-pre-wrap break-words overflow-hidden pointer-events-none ${editorFontFamily} ${paperMode ? 'text-gray-800' : 'text-text-dim'}`}"
);

// Negative highlight content with trailing newline handling
code = code.replace(
  /\{negativeEditorText \? renderHighlightedText\(negativeEditorText\) : <span className="opacity-50">Negative prompt\.\.\.<\/span>\}/,
  "{negativeEditorText ? <>{renderHighlightedText(negativeEditorText)}{negativeEditorText.endsWith('\\n') ? ' ' : ''}</> : <span className=\"opacity-50\">Negative prompt...</span>}"
);

// Negative textarea
code = code.replace(
  /className=\{`absolute inset-0 w-full h-full p-4 pt-2 \$\{editorFontFamily\} leading-relaxed overflow-y-auto whitespace-pre-wrap selection:bg-red-500\/30 selection:text-text-main bg-transparent text-transparent caret-text-main outline-none resize-none\`\}/,
  "className={`absolute inset-0 w-full h-full p-4 pt-2 ${editorFontFamily} leading-relaxed overflow-y-auto whitespace-pre-wrap break-words selection:bg-red-500/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none`}"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched textarea double-text bug fix");
