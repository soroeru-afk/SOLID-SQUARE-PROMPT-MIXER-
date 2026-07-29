const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [editorText, setEditorText] = useState(() => {
    return localStorage.getItem('ui_editor_text') || '';
  });
  const [negativeEditorText, setNegativeEditorText] = useState(() => {
    return localStorage.getItem('ui_negative_editor_text') || '';
  });`;

const newState = `  const [tabs, setTabs] = useState<{id: string, name: string, pos: string, neg: string}[]>(() => {
    const saved = localStorage.getItem('ui_editor_tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [{
      id: 'tab-1',
      name: 'TAB 01',
      pos: localStorage.getItem('ui_editor_text') || '',
      neg: localStorage.getItem('ui_negative_editor_text') || ''
    }];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    return localStorage.getItem('ui_active_tab_id') || 'tab-1';
  });

  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId) || tabs[0], [tabs, activeTabId]);
  const editorText = activeTab.pos;
  const negativeEditorText = activeTab.neg;

  useEffect(() => {
    localStorage.setItem('ui_editor_tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('ui_active_tab_id', activeTabId);
  }, [activeTabId]);

  const setEditorText = useCallback((updater: string | ((prev: string) => string)) => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        const newVal = typeof updater === 'function' ? updater(t.pos) : updater;
        return { ...t, pos: newVal };
      }
      return t;
    }));
  }, [activeTabId]);

  const setNegativeEditorText = useCallback((updater: string | ((prev: string) => string)) => {
    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        const newVal = typeof updater === 'function' ? updater(t.neg) : updater;
        return { ...t, neg: newVal };
      }
      return t;
    }));
  }, [activeTabId]);`;

code = code.replace(targetState, newState);

const removeEffects = /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('ui_editor_text', editorText\);\n\s*\}, \[editorText\]\);\n\s*useEffect\(\(\) => \{\n\s*localStorage\.setItem\('ui_negative_editor_text', negativeEditorText\);\n\s*\}, \[negativeEditorText\]\);/;

code = code.replace(removeEffects, "");

const oldHistory = /\/\/ History State for Undo\/Redo[\s\S]*?const redo = useCallback\(\(\) => \{[\s\S]*?\}, \[updateUndoState\]\);/;

const newHistory = `// History State for Undo/Redo
  const historyRef = useRef<Record<string, {pos: string, neg: string}[]>>({});
  const indexRef = useRef<Record<string, number>>({});

  const getHistory = useCallback((tabId: string) => {
    if (!historyRef.current[tabId]) {
      const tab = tabs.find(t => t.id === tabId) || tabs[0];
      historyRef.current[tabId] = [{pos: tab?.pos || '', neg: tab?.neg || ''}];
      indexRef.current[tabId] = 0;
    }
    return {
      history: historyRef.current[tabId],
      index: indexRef.current[tabId]
    };
  }, [tabs]);

  const updateUndoState = useCallback(() => {
    const { index, history } = getHistory(activeTabId);
    setCanUndo(index > 0);
    setCanRedo(index < history.length - 1);
  }, [activeTabId, getHistory]);

  const saveHistoryState = useCallback((pos: string, neg: string) => {
    const { history, index } = getHistory(activeTabId);
    const current = history[index];
    
    if (current && current.pos === pos && current.neg === neg) {
      return;
    }
    
    const newHistory = history.slice(0, index + 1);
    newHistory.push({pos, neg});
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    indexRef.current[activeTabId] = newHistory.length - 1;
    historyRef.current[activeTabId] = newHistory;
    updateUndoState();
  }, [activeTabId, getHistory, updateUndoState]);

  const undo = useCallback(() => {
    const { index, history } = getHistory(activeTabId);
    if (index > 0) {
      const newIdx = index - 1;
      indexRef.current[activeTabId] = newIdx;
      const state = history[newIdx];
      
      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) return { ...t, pos: state.pos, neg: state.neg };
        return t;
      }));
      updateUndoState();
    }
  }, [activeTabId, getHistory, updateUndoState]);

  const redo = useCallback(() => {
    const { index, history } = getHistory(activeTabId);
    if (index < history.length - 1) {
      const newIdx = index + 1;
      indexRef.current[activeTabId] = newIdx;
      const state = history[newIdx];
      
      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) return { ...t, pos: state.pos, neg: state.neg };
        return t;
      }));
      updateUndoState();
    }
  }, [activeTabId, getHistory, updateUndoState]);
  
  // Tab Management
  const handleTabAdd = useCallback(() => {
    const newId = \`tab-\${Date.now()}\`;
    // Find next available number
    const maxNum = tabs.reduce((max, t) => {
      const match = t.name.match(/TAB (\\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const newName = \`TAB \${String(maxNum + 1).padStart(2, '0')}\`;
    setTabs(prev => [...prev, { id: newId, name: newName, pos: '', neg: '' }]);
    setActiveTabId(newId);
  }, [tabs]);

  const handleTabChange = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const handleTabClose = useCallback((id: string) => {
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
      return newTabs;
    });
  }, [activeTabId]);

  const handleTabsClear = useCallback(() => {
    const newId = \`tab-\${Date.now()}\`;
    setTabs([{ id: newId, name: 'TAB 01', pos: '', neg: '' }]);
    setActiveTabId(newId);
    historyRef.current = {};
    indexRef.current = {};
    updateUndoState();
  }, [updateUndoState]);`;

code = code.replace(oldHistory, newHistory);

// Pass props to PreviewColumn
const previewColOld = /<PreviewColumn[\s\S]*?\/>/;
code = code.replace(previewColOld, (match) => {
  return match.replace('<PreviewColumn', `<PreviewColumn
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={handleTabChange}
          onTabAdd={handleTabAdd}
          onTabClose={handleTabClose}
          onTabsClear={handleTabsClear}`);
});

fs.writeFileSync('src/App.tsx', code);
