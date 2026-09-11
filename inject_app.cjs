const fs = require('fs');

const appFile = 'src/App.tsx';
let appCode = fs.readFileSync(appFile, 'utf8');

if (!appCode.includes('const handleTabReorder =')) {
  // Inject handleTabReorder after handleTabsClear
  appCode = appCode.replace(/const handleTabsClear = useCallback\(\(\) => \{[\s\S]*?\}, \[updateUndoState\]\);/, (match) => {
    return `${match}\n\n  const handleTabReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setTabs(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      let normalCount = 0;
      return updated.map(t => {
        if (t.isMemo) return t;
        normalCount++;
        return { ...t, name: \`TAB \${String(normalCount).padStart(2, '0')}\` };
      });
    });
  }, []);`;
  });

  fs.writeFileSync(appFile, appCode);
  console.log('App.tsx updated');
}
