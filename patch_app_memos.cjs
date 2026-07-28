const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import MemoColumn
code = code.replace(/import \{ PreviewColumn \} from '\.\/components\/PreviewColumn';/, "import { PreviewColumn } from './components/PreviewColumn';\nimport { MemoColumn } from './components/MemoColumn';");

// 2. Add state
const stateRegex = /const \[activeMasterTab, setActiveMasterTab\] = useState<'master' \| 'negative'>\(\(\) => \{[\s\S]*?\}\);/;
code = code.replace(stateRegex, `const [activeMasterTab, setActiveMasterTab] = useState<'master' | 'negative'>(() => {
    return (localStorage.getItem('ui_active_master_tab') as any) || 'master';
  });
  const [activeVariationTab, setActiveVariationTab] = useState<'parts' | 'memo'>(() => {
    return (localStorage.getItem('ui_active_variation_tab') as any) || 'parts';
  });
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);`);

// 3. Add to useEffect for activeTab
const tabEffectRegex = /localStorage\.setItem\('ui_active_master_tab', activeMasterTab\);\n\s*\}, \[activeMasterTab\]\);/;
code = code.replace(tabEffectRegex, `localStorage.setItem('ui_active_master_tab', activeMasterTab);
  }, [activeMasterTab]);
  useEffect(() => {
    localStorage.setItem('ui_active_variation_tab', activeVariationTab);
  }, [activeVariationTab]);`);

// 4. Add handler functions for memo
const handlerEndRegex = /const handleToggleBulkNegative = \(id: string, e: React\.MouseEvent\) => \{[\s\S]*?\}\);/;
const memoHandlers = `
  const handleSelectMemoId = (id: string | null, insert?: boolean) => {
    setSelectedMemoId(id);
    if (insert && id) {
      const memo = data.memos?.find(m => m.id === id);
      if (memo) {
        setEditorText(prev => prev ? prev + ', ' + memo.content : memo.content);
      }
    }
  };
  const handleAddMemo = (name: string) => {
    const newMemo = { id: generateId(), name, content: '' };
    setData(prev => ({ ...prev, memos: [newMemo, ...(prev.memos || [])] }));
  };
  const handleUpdateMemo = (id: string, updates: Partial<MasterPrompt>) => {
    setData(prev => ({
      ...prev,
      memos: (prev.memos || []).map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  };
  const handleDeleteMemo = (id: string) => {
    setData(prev => ({ ...prev, memos: (prev.memos || []).filter(m => m.id !== id) }));
    if (selectedMemoId === id) setSelectedMemoId(null);
  };
  const handleDeleteBulkMemo = (ids: string[]) => {
    const idSet = new Set(ids);
    setData(prev => ({ ...prev, memos: (prev.memos || []).filter(m => !idSet.has(m.id)) }));
    if (selectedMemoId && idSet.has(selectedMemoId)) setSelectedMemoId(null);
  };
  const handleDeleteAllMemo = () => {
    setData(prev => ({ ...prev, memos: [] }));
    setSelectedMemoId(null);
  };
  const handleMoveBulkMemos = (ids: string[], direction: 'top' | 'up' | 'down' | 'bottom') => {
    setData(prev => {
      const items = prev.memos || [];
      const idSet = new Set(ids);
      const selected = items.filter(m => idSet.has(m.id));
      const unselected = items.filter(m => !idSet.has(m.id));
      if (direction === 'top') {
        return { ...prev, memos: [...selected, ...unselected] };
      } else if (direction === 'bottom') {
        return { ...prev, memos: [...unselected, ...selected] };
      } else {
        // ... simplistic move for multiple isn't perfect, just using top/bottom for now
        return prev;
      }
    });
  };
  const handleReorderMemos = (startIndex: number, endIndex: number) => {
    setData(prev => {
      const result = Array.from(prev.memos || []);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, memos: result };
    });
  };
`;
// Actually, let's insert the memoHandlers right before `return (` of the component
code = code.replace(/return \(\s*<div className="flex flex-col h-screen bg-bg-base text-text-main">/m, `${memoHandlers}\n  return (\n    <div className="flex flex-col h-screen bg-bg-base text-text-main">`);

// 5. Replace VariationColumn usages with the activeTab logic
const vcRegex1 = /<VariationColumn\s+parts=\{data\.parts\}[\s\S]*?theme=\{theme\}\s*\/>/g;
// Because it appears twice (swapped and unswapped), we use string replace with function
let vcCount = 0;
code = code.replace(vcRegex1, (match) => {
  vcCount++;
  // We need to inject activeTab={activeVariationTab} setActiveTab={setActiveVariationTab}
  const injected = match.replace("theme={theme}", "theme={theme}\n              activeTab={activeVariationTab}\n              setActiveTab={setActiveVariationTab}");
  // Then we wrap the children
  return `${injected.replace('/>', '>')}\n              <MemoColumn
                masters={data.memos || []}
                selectedId={selectedMemoId}
                onSelect={handleSelectMemoId}
                onAdd={handleAddMemo}
                onUpdate={handleUpdateMemo}
                onDelete={handleDeleteMemo}
                onDeleteBulk={handleDeleteBulkMemo}
                onDeleteAll={handleDeleteAllMemo}
                onMoveBulk={handleMoveBulkMemos}
                onReorder={handleReorderMemos}
                onCopyToPart={(item) => setSavePartFromMasterData({ name: item.name, content: item.content })}
                onCopyBulkToPart={(items) => setSavePartFromMasterData({ items: items.map(i => ({name: i.name, content: i.content})) })}
                lang={lang}
              />\n            </VariationColumn>`;
});

fs.writeFileSync('src/App.tsx', code);
