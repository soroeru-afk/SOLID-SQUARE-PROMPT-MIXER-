const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Initial State Patch
const initRegex = /const \[tabs, setTabs\] = useState<\{id: string, name: string, pos: string, neg: string\}\[\]>\(\(\) => \{\n\s*const saved = localStorage\.getItem\('ui_editor_tabs'\);\n\s*if \(saved\) \{\n\s*try \{\n\s*const parsed = JSON\.parse\(saved\);\n\s*if \(Array\.isArray\(parsed\) && parsed\.length > 0\) return parsed;\n\s*\} catch \(e\) \{\}\n\s*\}/;

const initReplace = `const [tabs, setTabs] = useState<{id: string, name: string, pos: string, neg: string}[]>(() => {
    const saved = localStorage.getItem('ui_editor_tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t, i) => ({ ...t, name: \`TAB \${String(i + 1).padStart(2, '0')}\` }));
        }
      } catch (e) {}
    }`;

code = code.replace(initRegex, initReplace);


// 2. handleTabAdd Patch
const addRegex = /const handleTabAdd = useCallback\(\(\) => \{\n\s*const newId = `tab-\$\{Date\.now\(\)\}`;\n\s*\/\/ Find next available number\n\s*const maxNum = tabs\.reduce\(\(max, t\) => \{\n\s*const match = t\.name\.match\(\/TAB \(\\d\+\)\/\);\n\s*return match \? Math\.max\(max, parseInt\(match\[1\], 10\)\) : max;\n\s*\}, 0\);\n\s*const newName = `TAB \$\{String\(maxNum \+ 1\)\.padStart\(2, '0'\)\}`;\n\s*setTabs\(prev => \[\.\.\.prev, \{ id: newId, name: newName, pos: '', neg: '' \}\]\);\n\s*setActiveTabId\(newId\);\n\s*\}, \[tabs\]\);/;

const addReplace = `const handleTabAdd = useCallback(() => {
    const newId = \`tab-\${Date.now()}\`;
    setTabs(prev => {
      const newTabs = [...prev, { id: newId, name: '', pos: '', neg: '' }];
      return newTabs.map((t, i) => ({ ...t, name: \`TAB \${String(i + 1).padStart(2, '0')}\` }));
    });
    setActiveTabId(newId);
  }, []);`;

code = code.replace(addRegex, addReplace);

// 3. handleTabClose Patch
const closeRegex = /const handleTabClose = useCallback\(\(id: string\) => \{\n\s*setTabs\(prev => \{\n\s*if \(prev\.length === 1\) \{\n\s*const newId = `tab-\$\{Date\.now\(\)\}`;\n\s*delete historyRef\.current\[prev\[0\]\.id\];\n\s*delete indexRef\.current\[prev\[0\]\.id\];\n\s*setActiveTabId\(newId\);\n\s*return \[\{ id: newId, name: 'TAB 01', pos: '', neg: '' \}\];\n\s*\}\n\s*const newTabs = prev\.filter\(t => t\.id !== id\);\n\s*if \(activeTabId === id\) \{\n\s*setActiveTabId\(newTabs\[newTabs\.length - 1\]\.id\);\n\s*\}\n\s*delete historyRef\.current\[id\];\n\s*delete indexRef\.current\[id\];\n\s*return newTabs;\n\s*\}\);\n\s*\}, \[activeTabId\]\);/;

const closeReplace = `const handleTabClose = useCallback((id: string) => {
    setTabs(prev => {
      if (prev.length === 1) {
        const newId = \`tab-\${Date.now()}\`;
        delete historyRef.current[prev[0].id];
        delete indexRef.current[prev[0].id];
        setActiveTabId(newId);
        return [{ id: newId, name: 'TAB 01', pos: '', neg: '' }];
      }
      const newTabs = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      delete historyRef.current[id];
      delete indexRef.current[id];
      return newTabs.map((t, i) => ({ ...t, name: \`TAB \${String(i + 1).padStart(2, '0')}\` }));
    });
  }, [activeTabId]);`;

code = code.replace(closeRegex, closeReplace);

fs.writeFileSync('src/App.tsx', code);
