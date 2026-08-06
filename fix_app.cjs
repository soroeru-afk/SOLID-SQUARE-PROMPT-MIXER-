const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace AppData initial load
const dataRegex = /const \[data, setData\] = useState<AppData>\(\(\) => \{[\s\S]*?return initialData;\n\s*\}\);/;
if (content.match(dataRegex)) {
  content = content.replace(dataRegex, 'const [data, setData] = useState<AppData>(initialData);');
  console.log('App data useState patched');
} else {
  console.log('App data useState NOT MATCHED');
}

// Replace tabs initial load
const tabsRegex = /const \[tabs, setTabs\] = useState<\{id: string, name: string, pos: string, neg: string\}\[\]>\(\(\) => \{[\s\S]*?return \[\{\s*id: 'tab-1',\s*name: 'TAB 01',\s*pos: localStorage\.getItem\('ui_editor_text'\) \|\| '',\s*neg: localStorage\.getItem\('ui_negative_editor_text'\) \|\| ''\s*\}\];\n\s*\}\);/;
if (content.match(tabsRegex)) {
  content = content.replace(tabsRegex, "const [tabs, setTabs] = useState<{id: string, name: string, pos: string, neg: string}[]>([{ id: 'tab-1', name: 'TAB 01', pos: '', neg: '' }]);");
  console.log('App tabs useState patched');
} else {
  console.log('App tabs useState NOT MATCHED');
}

fs.writeFileSync('src/App.tsx', content);
