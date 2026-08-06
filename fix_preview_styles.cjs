const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const sharedClasses = `absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none`;

// Replace div classes
content = content.replace(
  /className=\{\`absolute inset-0 w-full h-full p-4 pt-2 whitespace-pre-wrap break-words overflow-y-auto pointer-events-none \$\{editorFontFamily\} \$\{paperMode \? 'text-gray-800' : 'text-text-dim'\}\`\}/g,
  `className={\`${sharedClasses} pointer-events-none \$\{editorFontFamily\} \$\{paperMode ? 'text-gray-800' : 'text-text-dim'\}\`}`
);

// Replace textarea classes
content = content.replace(
  /className=\{\`absolute inset-0 w-full h-full p-4 pt-2 \$\{editorFontFamily\} overflow-y-auto whitespace-pre-wrap break-words selection:bg-blue-500\/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`\}/g,
  `className={\`${sharedClasses} \$\{editorFontFamily\} selection:bg-blue-500/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`}`
);

// Do the same for negative textarea
content = content.replace(
  /className=\{\`absolute inset-0 w-full h-full p-4 pt-2 \$\{editorFontFamily\} overflow-y-auto whitespace-pre-wrap break-words selection:bg-red-500\/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`\}/g,
  `className={\`${sharedClasses} \$\{editorFontFamily\} selection:bg-red-500/40 selection:text-transparent bg-transparent text-transparent caret-text-main outline-none resize-none\`}`
);


fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Fixed PreviewColumn textarea styles');
