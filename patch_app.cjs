const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/\r\n/g, '\n'); // Normalize newlines

// 1. Update tabs type
code = code.replace(
  /useState<\{id: string, name: string, pos: string, neg: string\}\[\]>\(\(\) => \{/g,
  "useState<{id: string, name: string, pos: string, neg: string, isMemo?: boolean}[]>(() => {"
);

// 2. Comma logic
const oldCommaLogic = "        if (cleanedLine.length > 0) {\n          cleanedLine = cleanedLine.replace(/[\\s,]*$/, ',');\n        }";
const newCommaLogic = "        if (cleanedLine.length > 0) {\n          if (!/[。！？：…・、,」』】）]$/.test(cleanedLine)) {\n            cleanedLine = cleanedLine.replace(/[\\s,]*$/, ',');\n          }\n        }";
if (code.includes(oldCommaLogic)) {
  code = code.replace(oldCommaLogic, newCommaLogic);
} else {
  console.log("oldCommaLogic not found!");
}

// 3. New memo tab logic
const oldMemoTabAdd = "            const newTabs = [...prev, { id: newId, name: '', pos: memo.content, neg: '' }];\n            return newTabs.map((t, i) => ({ ...t, name: `TAB ${String(i + 1).padStart(2, '0')}` }));";
const newMemoTabAdd = "            const newTabs = [...prev, { id: newId, name: `📝 ${memo.name}`, pos: memo.content, neg: '', isMemo: true }];\n            let normalCount = 0;\n            return newTabs.map((t) => {\n              if (t.isMemo) return t;\n              normalCount++;\n              return { ...t, name: `TAB ${String(normalCount).padStart(2, '0')}` };\n            });";
if (code.includes(oldMemoTabAdd)) {
  code = code.replace(oldMemoTabAdd, newMemoTabAdd);
} else {
  console.log("oldMemoTabAdd not found!");
}

// 4. Same memo tab update
const oldMemoTabUpdate = "          setEditorText(memo.content);";
const newMemoTabUpdate = "          setTabs(prev => prev.map(t => {\n            if (t.id === activeTabId) return { ...t, name: `📝 ${memo.name}`, pos: memo.content, isMemo: true };\n            return t;\n          }));";
if (code.includes(oldMemoTabUpdate)) {
  code = code.replace(oldMemoTabUpdate, newMemoTabUpdate);
} else {
  console.log("oldMemoTabUpdate not found!");
}

// 5. Tab truncation in render
const oldTabTruncate = "                  {tab.name}\n                  {tabs.length > 1 ? (";
const newTabTruncate = "                  <span className=\"truncate max-w-[120px]\" title={tab.name}>{tab.name}</span>\n                  {tabs.length > 1 ? (";
if (code.includes(oldTabTruncate)) {
  code = code.replace(oldTabTruncate, newTabTruncate);
} else {
  console.log("oldTabTruncate not found!");
}

// 6. activeTab.isMemo in PreviewColumn props
const oldPreviewProps = "          <PreviewColumn\n          selectedMasterId={selectedMasterId}";
const newPreviewProps = "          <PreviewColumn\n          isMemoTab={activeTab?.isMemo || false}\n          selectedMasterId={selectedMasterId}";
if (code.includes(oldPreviewProps)) {
  code = code.replace(oldPreviewProps, newPreviewProps);
} else {
  console.log("oldPreviewProps not found!");
}

// 7. Update autoOptimize early return
const oldCleanStringTop = "  const cleanString = (text: string) => {\n    if (!autoOptimize) return text;";
const newCleanStringTop = "  const cleanString = (text: string) => {\n    if (!autoOptimize || activeTab?.isMemo) return text;";
if (code.includes(oldCleanStringTop)) {
  code = code.replace(oldCleanStringTop, newCleanStringTop);
} else {
  console.log("oldCleanStringTop not found!");
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx patched.");
