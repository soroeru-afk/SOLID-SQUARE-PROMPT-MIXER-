const fs = require('fs');

const appFile = 'src/App.tsx';
let appCode = fs.readFileSync(appFile, 'utf8');

// Inject handleTabReorder
if (!appCode.includes('handleTabReorder')) {
  appCode = appCode.replace(/const updateUndoState = useCallback\(\(\) => \{[\s\S]*?\}, \[.*?\]\);\s*useEffect\(\(\) => \{\s*updateUndoState\(\);\s*\}, \[updateUndoState\]\);/g, (match) => {
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

  // Inject prop to PreviewColumn in App.tsx
  appCode = appCode.replace(/onTabsClear=\{handleTabsClear\}/, 'onTabsClear={handleTabsClear}\n            onTabReorder={handleTabReorder}');
  fs.writeFileSync(appFile, appCode);
  console.log('App.tsx updated');
}

const previewFile = 'src/components/PreviewColumn.tsx';
let previewCode = fs.readFileSync(previewFile, 'utf8');

if (!previewCode.includes('draggedTabIndex')) {
  // Add props
  previewCode = previewCode.replace(/onTabsClear\?: \(\) => void;/, 'onTabsClear?: () => void;\n  onTabReorder?: (from: number, to: number) => void;');
  previewCode = previewCode.replace(/onTabsClear,\s*editorText/, 'onTabsClear, onTabReorder,\n  editorText');

  // Add state
  previewCode = previewCode.replace(/const \[showFormatOptions, setShowFormatOptions\] = useState\(false\);/, 'const [showFormatOptions, setShowFormatOptions] = useState(false);\n  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);\n  const [dragOverTabIndex, setDragOverTabIndex] = useState<number | null>(null);');

  // Update tabs.map
  const newTabsMap = `{tabs.map((tab, index) => (
                <div 
                  key={tab.id}
                  draggable={true}
                  onDragStart={(e) => {
                    setDraggedTabIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(index));
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverTabIndex !== index) {
                      setDragOverTabIndex(index);
                    }
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOverTabIndex(index);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedTabIndex !== null && draggedTabIndex !== index) {
                      if (onTabReorder) {
                        onTabReorder(draggedTabIndex, index);
                      }
                    }
                    setDraggedTabIndex(null);
                    setDragOverTabIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedTabIndex(null);
                    setDragOverTabIndex(null);
                  }}
                  className={\`group flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono border cursor-pointer whitespace-nowrap transition-all \${
                    activeTabId === tab.id 
                      ? ((theme === 'light' || theme === 'mono') ? 'bg-gray-700 border-gray-700 text-white shadow-sm' : 'bg-white border-white text-gray-900 shadow-sm') 
                      : 'bg-bg-base border-border-main text-text-dim hover:bg-bg-input hover:text-text-main hover:border-border-hover'
                  } \${draggedTabIndex === index ? 'opacity-40' : ''} \${dragOverTabIndex === index ? 'border-blue-500 border-l-2' : ''}\`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <span className="truncate max-w-[120px]" title={tab.name}>{tab.name}</span>
                  {tabs.length > 1 ? (
                    <button 
                      draggable={false}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (onTabClose) onTabClose(tab.id);
                      }}
                      className={\`ml-1 w-3.5 h-3.5 flex items-center justify-center transition-colors \${
                        activeTabId === tab.id 
                          ? 'opacity-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-red-400' 
                          : 'opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 hover:text-red-400'
                      }\`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <div className="ml-1 w-3.5 h-3.5 flex items-center justify-center opacity-0 pointer-events-none shrink-0">
                      <X className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}`;

  // Replace tabs.map(tab => (...)) with the new version
  previewCode = previewCode.replace(/\{tabs\.map\(tab => \([\s\S]*?\n\s*\)\)\}/, newTabsMap);
  fs.writeFileSync(previewFile, previewCode);
  console.log('PreviewColumn.tsx updated');
}
