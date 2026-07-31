const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

// The scroll container starts here:
// <div className="flex-1 overflow-y-scroll p-2 space-y-2 bg-bg-panel relative">
// Inside it is the sticky block:
// <div className="sticky top-0 z-20 bg-bg-panel/90 backdrop-blur pb-2 mb-2 border-b border-border-main">
// We want to extract this sticky block out of the scroll container.

// Let's first locate the scroll container div
const scrollContainerMatch = code.match(/<div className="flex-1 overflow-y-scroll p-2 space-y-2 bg-bg-panel relative">/);
if (scrollContainerMatch) {
  // Find the sticky div
  const stickyDivRegex = /<div className="sticky top-0 z-20 bg-bg-panel\/90 backdrop-blur pb-2 mb-2 border-b border-border-main">\s*([\s\S]*?)<\/div>\s*<\/div>\s*\{currentList\.filter/;
  
  const match = code.match(stickyDivRegex);
  if (match) {
    const innerContent = match[1]; // This is the content inside the sticky div (the <div className="flex flex-wrap... ">...</div>)
    
    // We will replace the whole scroll container + sticky div with:
    // 1. A new static header for the bulk bar
    // 2. The scroll container without the sticky div
    
    code = code.replace(
      /<div className="flex-1 overflow-y-scroll p-2 space-y-2 bg-bg-panel relative">\s*<div className="sticky top-0 z-20 bg-bg-panel\/90 backdrop-blur pb-2 mb-2 border-b border-border-main">\s*[\s\S]*?<\/div>\s*<\/div>\s*\{currentList\.filter/m,
      `<div className="p-2 border-b border-border-main bg-bg-panel shrink-0 z-10 shadow-sm">\n${innerContent}</div>\n      <div className="flex-1 overflow-y-scroll p-2 space-y-2 bg-bg-panel relative">\n        {currentList.filter`
    );
    
    fs.writeFileSync('src/components/MasterColumn.tsx', code);
    console.log("Successfully extracted bulk bar from scroll area");
  } else {
    console.log("Could not find the sticky div pattern");
  }
} else {
  console.log("Could not find the scroll container pattern");
}
