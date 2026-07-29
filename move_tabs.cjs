const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const tabsStartStr = "\\{\\/\\* Tabs \\*\\/\\}\\n\\s*\\{tabs && tabs\\.length > 0 && onTabChange && \\([\\s\\S]*?<div className=\"flex items-center overflow-x-auto px-2 py-1\\.5 bg-bg-panel border-b border-border-main shrink-0 \\[&::-webkit-scrollbar\\]:hidden\" style=\\{\\{ gap: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' \\}\\}>[\\s\\S]*?ALL CLEAR[\\s\\S]*?<\\/button>\\s*<\\/div>\\s*\\)\\}";

const tabsRegex = new RegExp(tabsStartStr);
const match = code.match(tabsRegex);
if (!match) {
  console.log("Could not find tabs block");
  process.exit(1);
}
let tabsBlock = match[0];

// Remove tabs block from its current location
code = code.replace(tabsRegex, "");

// Insert inside the p-4 container
const containerRegex = /<div className="flex-1 p-4 overflow-y-auto bg-bg-panel flex flex-col gap-4">/;
if (!code.match(containerRegex)) {
  console.log("Could not find container");
  process.exit(1);
}

// Change tabs styling to look more like attached tabs
tabsBlock = tabsBlock.replace('bg-bg-panel border-b border-border-main', 'bg-transparent pb-0');
tabsBlock = tabsBlock.replace('px-2 py-1.5', 'px-0 pt-0 pb-2');
// Also remove border-b and just make it a flex container

code = code.replace(containerRegex, `$&
        ${tabsBlock}`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Success");
