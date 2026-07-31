const fs = require('fs');

let master = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

// 1. Make MasterColumn bulk action bar always visible (remove the conditional)
const bulkBarRegex = /\{\s*bulkSelectedIds\.size > 0 && viewMode === 'list' && \([\s\S]*?<div className="sticky top-0 z-20 bg-bg-panel\/90 backdrop-blur pb-2 mb-2 border-b border-border-main">/m;
if (bulkBarRegex.test(master)) {
  master = master.replace(bulkBarRegex, `<div className="sticky top-0 z-20 bg-bg-panel/90 backdrop-blur pb-2 mb-2 border-b border-border-main">`);
  // Need to remove the closing )} for this block which is right before the {currentList.filter
  const closingBraceRegex = /<\/div>\s*<\/div>\s*\)\}\s*\{currentList\.filter/m;
  master = master.replace(closingBraceRegex, `</div>\n          </div>\n        {currentList.filter`);
}

// Update the container class to reflect size
master = master.replace(
  /<div className="flex flex-wrap items-center gap-2 bg-bg-surface p-2 border border-blue-500\/30 rounded shadow-sm shrink-0 min-h-\[42px\]">/,
  '<div className={`flex flex-wrap items-center gap-2 bg-bg-surface p-2 border ${bulkSelectedIds.size > 0 ? "border-blue-500/30" : "border-border-main"} rounded shadow-sm shrink-0 min-h-[42px]`}>'
);

// Update badge color based on size
master = master.replace(
  /<span className="text-\[10px\] font-mono text-blue-400 flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500\/10 rounded-full font-bold">\{bulkSelectedIds\.size\}<\/span>/,
  '<span className={`text-[10px] font-mono flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-bold ${bulkSelectedIds.size > 0 ? "text-blue-400 bg-blue-500/10" : "text-text-dim bg-bg-input"}`}>{bulkSelectedIds.size}</span>'
);

// Add disabled to select
master = master.replace(
  /className="flex-1 min-w-\[70px\] bg-bg-input hover:bg-gray-500 hover:text-white border border-border-hover text-text-main text-\[10px\] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer"/,
  'disabled={bulkSelectedIds.size === 0}\n                  className="flex-1 min-w-[70px] bg-bg-input hover:bg-text-main hover:text-bg-base border border-border-hover text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:hover:bg-bg-input disabled:hover:text-text-main"'
);

// Add disabled to mark buttons
master = master.replace(
  /className=\{\`w-5 h-5 rounded flex items-center justify-center text-xs hover:bg-bg-input \$\{m === '✔' \? 'text-blue-500' : ''\}\`\}/,
  'disabled={bulkSelectedIds.size === 0}\n                      className={`w-5 h-5 rounded flex items-center justify-center text-xs hover:bg-bg-input ${m === "✔" ? "text-blue-500" : ""} disabled:opacity-50`}'
);

// Add disabled to move buttons
master = master.replace(/className="w-5 h-5 rounded flex items-center justify-center hover:bg-bg-input text-text-dim hover:text-text-main"/g, 'disabled={bulkSelectedIds.size === 0} className="w-5 h-5 rounded flex items-center justify-center hover:bg-bg-input text-text-dim hover:text-text-main disabled:opacity-50"');

// Add disabled to delete bulk button
master = master.replace(
  /<button onClick=\{\(\) => setConfirmDeleteBulk\(true\)\} className="flex items-center gap-1 px-2 py-1 bg-transparent hover:bg-red-500\/10 border border-red-500\/50 rounded text-\[10px\] font-mono text-red-500 transition-colors whitespace-nowrap">/,
  '<button onClick={() => setConfirmDeleteBulk(true)} disabled={bulkSelectedIds.size === 0} className="flex items-center gap-1 px-2 py-1 bg-transparent hover:bg-red-500/10 border border-red-500/50 rounded text-[10px] font-mono text-red-500 transition-colors whitespace-nowrap disabled:opacity-50">'
);

// Add disabled to clear selection button
master = master.replace(
  /<button onClick=\{\(\) => setBulkSelectedIds\(new Set\(\)\)\} className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-\[10px\] font-mono text-text-dim hover:text-text-main transition-colors whitespace-nowrap">/,
  '<button onClick={() => setBulkSelectedIds(new Set())} disabled={bulkSelectedIds.size === 0} className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[10px] font-mono text-text-dim hover:text-text-main transition-colors whitespace-nowrap disabled:opacity-50">'
);

// Fix cancel button hover in MasterColumn
master = master.replace(
  /className="px-3 py-1\.5 bg-bg-input hover:bg-gray-500 hover:text-white text-text-dim rounded text-\[10px\] font-mono transition-colors"/g,
  'className="px-3 py-1.5 bg-bg-input hover:bg-text-main hover:text-bg-base border border-transparent hover:border-border-hover text-text-dim rounded text-[10px] font-mono transition-colors"'
);

fs.writeFileSync('src/components/MasterColumn.tsx', master);

let variation = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// Fix dropdown hover in VariationColumn
variation = variation.replace(
  /className="flex-1 min-w-\[70px\] bg-bg-input border border-border-main text-text-main text-\[10px\] font-mono px-2 py-1 rounded outline-none disabled:opacity-50"/g,
  'className="flex-1 min-w-[70px] bg-bg-input hover:bg-text-main hover:text-bg-base border border-border-main text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:hover:bg-bg-input disabled:hover:text-text-main"'
);

// Fix cancel button hover in VariationColumn
variation = variation.replace(
  /className="px-3 py-1\.5 bg-bg-input hover:bg-gray-500 hover:text-white text-text-dim rounded text-\[10px\] font-mono transition-colors"/g,
  'className="px-3 py-1.5 bg-bg-input hover:bg-text-main hover:text-bg-base border border-transparent hover:border-border-hover text-text-dim rounded text-[10px] font-mono transition-colors"'
);

fs.writeFileSync('src/components/VariationColumn.tsx', variation);

console.log("Patched everything");
