const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const \[tabs, setTabs\] = useState<\{id: string, name: string, pos: string, neg: string\}\[\]>\(\(\) => \{[\s\S]*?return \[\{\s*id: 'tab_[\s\S]*?\}\];\n\s*\}\);/;

if (content.match(regex)) {
  const replacement = `const [tabs, setTabs] = useState<{id: string, name: string, pos: string, neg: string}[]>(() => {
    const saved = localStorage.getItem('ui_editor_tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t, i) => ({ ...t, name: \`TAB \${String(i + 1).padStart(2, '0')}\` }));
        }
      } catch (e) {}
    }
    return [{ id: 'tab_' + Date.now(), name: 'TAB 01', pos: '', neg: '' }];
  });

  useEffect(() => {
    const handleImport = () => {
      const saved = localStorage.getItem('ui_editor_tabs');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTabs(parsed.map((t, i) => ({ ...t, name: \`TAB \${String(i + 1).padStart(2, '0')}\` })));
          }
        } catch (e) {}
      }
    };
    window.addEventListener('attributeMixerDataImported', handleImport);
    return () => window.removeEventListener('attributeMixerDataImported', handleImport);
  }, []);`;
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Patched App tabs');
} else {
  console.log('Not found');
}
