const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 4. Same memo tab update
code = code.replace(
  /setEditorText\(memo\.content\);/g,
  "setTabs(prev => prev.map(t => {\n            if (t.id === activeTabId) return { ...t, name: `📝 ${memo.name}`, pos: memo.content, isMemo: true };\n            return t;\n          }));"
);

// 5. Tab truncation in render
// We need to replace `{tab.name}` inside `<button className={`flex items-center gap-1.5 px-3 py-1.5 border-r...`
code = code.replace(
  /onClick=\{\(\) => onTabChange\(tab\.id\)\}\n\s*>\n\s*\{tab\.name\}\n\s*\{tabs\.length > 1/g,
  "onClick={() => onTabChange(tab.id)}\n                >\n                  <span className=\"truncate max-w-[120px]\" title={tab.name}>{tab.name}</span>\n                  {tabs.length > 1"
);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx patched part 2.");
