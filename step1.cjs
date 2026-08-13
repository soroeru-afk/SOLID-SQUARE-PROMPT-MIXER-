const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. In collapsed category label (line 965+), replace the checkmark with the square badge, and remove the red color logic.
const collapsedTarget = /\{isSelected && \(\s*<div className=\{\`flex items-center justify-center w-3\.5 h-3\.5 rounded-full shrink-0 \$\{cat\.isNegative \? \(theme === 'mono' \? 'bg-black text-white' : 'bg-red-500 text-white'\) : \(theme === 'mono' \? 'bg-black text-white' : 'bg-blue-500 text-white'\)\}\`\}>\s*<Check className="w-2\.5 h-2\.5" strokeWidth=\{3\} \/>\s*<\/div>\s*\)\}/;
const collapsedReplacement = `{isSelected && (
                  <div className={\`flex items-center justify-center min-w-[16px] h-4 px-1 rounded-[3px] shrink-0 text-[10px] font-bold shadow-sm \${theme === 'mono' ? 'bg-black text-white' : 'bg-gray-500 text-white'}\`} title="選択数">
                    {currentIndices.filter(idx => idx !== 0).length}
                  </div>
                )}`;
content = content.replace(collapsedTarget, collapsedReplacement);

// 2. In expanded category, next to dropdown (line 1118+), it currently has the badge I added.
const dropdownBadgeTarget = /\{isSelected && \(\s*<div className=\{\`absolute left-0 top-1\/2 -translate-y-1\/2 pointer-events-none w-3\.5 h-3\.5 flex items-center justify-center rounded-\[3px\] text-\[10px\] font-bold \$\{cat\.isNegative \? \(theme === 'mono' \? 'bg-black text-white' : 'bg-red-500 text-white'\) : \(theme === 'mono' \? 'bg-black text-white' : 'bg-blue-500 text-white'\)\}\`\} title="選択数">\s*\{currentIndices\.filter\(idx => idx !== 0\)\.length\}\s*<\/div>\s*\)\}/;
const dropdownBadgeReplacement = `{isSelected && (
              <div className={\`absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none min-w-[16px] h-4 px-1 flex items-center justify-center rounded-[3px] text-[10px] font-bold shadow-sm \${theme === 'mono' ? 'bg-black text-white' : 'bg-gray-500 text-white'}\`} title="選択数">
                {currentIndices.filter(idx => idx !== 0).length}
              </div>
            )}`;
content = content.replace(dropdownBadgeTarget, dropdownBadgeReplacement);

// 3. Remove red from dropdown border (line 1128+)
const dropdownBorderTarget = /border \$\{isSelected \? \(cat\.isNegative \? \(theme === 'mono' \? 'border-black shadow-\[0_0_8px_rgba\(0,0,0,0\.1\)\]' : 'border-red-500\/50 shadow-\[0_0_8px_rgba\(239,68,68,0\.1\)\]'\) : \(theme === 'mono' \? 'border-black shadow-\[0_0_8px_rgba\(0,0,0,0\.1\)\]' : 'border-blue-500\/50 shadow-\[0_0_8px_rgba\(59,130,246,0\.1\)\]'\)\) : 'border-border-main'\}/;
const dropdownBorderReplacement = `border \${isSelected ? (theme === 'mono' ? 'border-black shadow-[0_0_8px_rgba(0,0,0,0.1)]' : 'border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.1)]') : 'border-border-main'}`;
content = content.replace(dropdownBorderTarget, dropdownBorderReplacement);

// 4. Remove red from category container border (line 1008+)
const catContainerTarget = /className=\{\`flex flex-col gap-2 p-2 border rounded \$\{cat\.isNegative \? \(theme === 'mono' \? 'border-black\/30 bg-black\/5' : 'border-red-500\/30 bg-red-500\/5'\) : \(theme === 'mono' \? 'border-black\/30 bg-black\/5' : 'border-blue-500\/30 bg-blue-500\/5'\)\}\`\}/;
const catContainerReplacement = `className={\`flex flex-col gap-2 p-2 border rounded \${theme === 'mono' ? 'border-black/30 bg-black/5' : 'border-blue-500/30 bg-blue-500/5'}\`}`;
content = content.replace(catContainerTarget, catContainerReplacement);

// 5. Remove red from Add New Item button (line 1110+)
const addNewTarget = /className=\{\`flex items-center justify-center gap-1 w-full py-1\.5 mt-1 border border-dashed rounded text-\[11px\] transition-colors \$\{cat\.isNegative \? \(theme === 'mono' \? 'border-black\/50 text-black hover:bg-black\/10' : 'border-red-500\/50 text-red-500 hover:bg-red-500\/10'\) : \(theme === 'mono' \? 'border-black\/50 text-black hover:bg-black\/10' : 'border-blue-500\/50 text-blue-500 hover:bg-blue-500\/10'\)\}\`\}/;
const addNewReplacement = `className={\`flex items-center justify-center gap-1 w-full py-1.5 mt-1 border border-dashed rounded text-[11px] transition-colors \${theme === 'mono' ? 'border-black/50 text-black hover:bg-black/10' : 'border-blue-500/50 text-blue-500 hover:bg-blue-500/10'}\`}`;
content = content.replace(addNewTarget, addNewReplacement);

// 6. Remove red from dropdown checkmarks (line 1162+)
const checkboxTarget = /className=\{\`rounded bg-bg-surface border-border-main cursor-pointer w-4 h-4 \$\{cat\.isNegative \? \(theme === 'mono' \? 'text-black focus:ring-black' : 'text-red-500 focus:ring-red-500\/50'\) : \(theme === 'mono' \? 'text-black focus:ring-black' : 'text-blue-500 focus:ring-blue-500\/50'\)\}\`\}/;
const checkboxReplacement = `className={\`rounded bg-bg-surface border-border-main cursor-pointer w-4 h-4 \${theme === 'mono' ? 'text-black focus:ring-black' : 'text-blue-500 focus:ring-blue-500/50'}\`}`;
content = content.replace(checkboxTarget, checkboxReplacement);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
