const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// I will add break-all to ensure identical wrapping for CJK and English, and remove the scrollbar from the div to avoid double scrollbars on some OS.
// Wait, removing scrollbar from div might change its inner width on OS with thick scrollbars! 
// Oh! If I remove the scrollbar from the div (using overflow-hidden), the div gets WIDER inner width.
// Then the textarea (with scrollbar) gets NARROWER inner width. This GUARANTEES misalignment on Windows!
// So they MUST both have exactly the same overflow property: overflow-y-auto!

const sharedClasses = `absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-all overflow-y-auto block tracking-normal focus:ring-0 shadow-none`;

content = content.replace(
  /absolute inset-0 w-full h-full p-4 pt-2 m-0 border-none rounded-none appearance-none whitespace-pre-wrap break-words overflow-y-auto block tracking-normal focus:ring-0 shadow-none/g,
  sharedClasses
);

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Fixed break-all in PreviewColumn');
