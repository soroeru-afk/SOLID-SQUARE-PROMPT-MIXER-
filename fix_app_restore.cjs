const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const [data, setData] = useState<AppData>(initialData);',
  `const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('prompt_console_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppData;
        if (!parsed.parts.some(p => p.section === 2)) {
          const newPoses = initialData.parts.filter(p => p.section === 2);
          parsed.parts = [...parsed.parts, ...newPoses];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return initialData;
  });`
);

content = content.replace(
  "const [tabs, setTabs] = useState<{id: string, name: string, pos: string, neg: string}[]>([{ id: 'tab-1', name: 'TAB 01', pos: '', neg: '' }]);",
  `const [tabs, setTabs] = useState<{id: string, name: string, pos: string, neg: string}[]>(() => {
    const saved = localStorage.getItem('ui_editor_tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t, i) => ({ ...t, name: \`TAB \${String(i + 1).padStart(2, '0')}\` }));
        }
      } catch (e) {}
    }
    return [{
      id: 'tab-1',
      name: 'TAB 01',
      pos: localStorage.getItem('ui_editor_text') || '',
      neg: localStorage.getItem('ui_negative_editor_text') || ''
    }];
  });`
);

fs.writeFileSync('src/App.tsx', content);
