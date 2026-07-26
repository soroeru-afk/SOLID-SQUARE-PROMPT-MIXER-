import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MasterColumn } from './components/MasterColumn';
import { VariationColumn } from './components/VariationColumn';
import { PreviewColumn } from './components/PreviewColumn';
import { SavePartModal } from './components/SavePartModal';
import { SaveMasterModal } from './components/SaveMasterModal';
import { initialData } from './data';
import { AppData, MasterPrompt, VariationPart } from './types';
import { Language, t, translations } from './i18n';
import { ArrowLeftRight, Undo2, Redo2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFileHandle, setFileHandle } from './idb';

const STORAGE_KEY = 'prompt_console_data';

export default function App() {
  const [lang, setLang] = useState<Language>('ja');
  const [theme, setTheme] = useState<'dark' | 'red' | 'light' | 'navy' | 'black'>('dark');
  const [paperMode, setPaperMode] = useState<boolean>(false);
  const [activeMasterTab, setActiveMasterTab] = useState<'master' | 'negative'>('master');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppData;
        // Migration: If no parts with section 2 exist, merge them from initialData
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
  });

  const [autoOptimize, setAutoOptimize] = useState<boolean>(() => {
    const saved = localStorage.getItem('auto_optimize');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('auto_optimize', String(autoOptimize));
  }, [autoOptimize]);

  const [savePartFromMasterData, setSavePartFromMasterData] = useState<{name?: string, content?: string, items?: {name: string, content: string}[]} | null>(null);
  const [saveMasterFromPartData, setSaveMasterFromPartData] = useState<{name?: string, content?: string, items?: {name: string, content: string}[]} | null>(null);

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [selectedNegativeId, setSelectedNegativeId] = useState<string | null>(null);
  const [editorText, setEditorText] = useState('');
  const [negativeEditorText, setNegativeEditorText] = useState('');
  const [activeEditor, setActiveEditor] = useState<'positive' | 'negative'>('positive');
  const [positiveCursorPos, setPositiveCursorPos] = useState<number | null>(null);
  const [negativeCursorPos, setNegativeCursorPos] = useState<number | null>(null);

  // History State for Undo/Redo
  const historyRef = useRef<{pos: string, neg: string}[]>([{pos: '', neg: ''}]);
  const indexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateUndoState = useCallback(() => {
    setCanUndo(indexRef.current > 0);
    setCanRedo(indexRef.current < historyRef.current.length - 1);
  }, []);

  const saveHistoryState = useCallback((pos: string, neg: string) => {
    const history = historyRef.current;
    const index = indexRef.current;
    const current = history[index];
    
    if (current && current.pos === pos && current.neg === neg) {
      return;
    }
    
    const newHistory = history.slice(0, index + 1);
    newHistory.push({pos, neg});
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    indexRef.current = newHistory.length - 1;
    historyRef.current = newHistory;
    updateUndoState();
  }, [updateUndoState]);

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      const state = historyRef.current[indexRef.current];
      setEditorText(state.pos);
      setNegativeEditorText(state.neg);
      updateUndoState();
    }
  }, [updateUndoState]);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      const state = historyRef.current[indexRef.current];
      setEditorText(state.pos);
      setNegativeEditorText(state.neg);
      updateUndoState();
    }
  }, [updateUndoState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveHistoryState(editorText, negativeEditorText);
    }, 1000);
    return () => clearTimeout(timer);
  }, [editorText, negativeEditorText, saveHistoryState]);

  const selectedPartIds = useMemo(() => {
    const ids = new Set<string>();
    data.parts.forEach(p => {
      if (editorText.includes(p.content) || negativeEditorText.includes(p.content)) {
        ids.add(p.id);
      }
    });
    return ids;
  }, [data.parts, editorText, negativeEditorText]);

  const [sidebarSwapped, setSidebarSwapped] = useState(() => {
    return localStorage.getItem('sidebar_swapped') === 'true';
  });
  const [leftWidth, setLeftWidth] = useState(() => {
    return Math.max(320, Number(localStorage.getItem('left_width')) || 320);
  });
  const [rightWidth, setRightWidth] = useState(() => {
    return Math.max(384, Number(localStorage.getItem('right_width')) || 384);
  });
  
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const [exportDirectoryName, setExportDirectoryName] = useState<string>('');
  const [iframeWarning, setIframeWarning] = useState(false);

  useEffect(() => {
    getFileHandle('export_directory').then(handle => {
      if (handle && handle.name) {
        setExportDirectoryName(handle.name);
      }
    });
  }, []);

  const handleChangeExportDir = async () => {
    if ('showDirectoryPicker' in window && window.self === window.top) {
      try {
        const handle = await (window as any).showDirectoryPicker({
          id: 'prompt_mixer_export_dir',
          mode: 'readwrite'
        });
        if (handle) {
          await setFileHandle('export_directory', handle);
          setExportDirectoryName(handle.name);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Directory Picker API Error:', err);
        }
      }
    } else {
      setIframeWarning(true);
    }
  };

  const handleClearExportDir = async () => {
    await clearFileHandle('export_directory');
    setExportDirectoryName('');
  };


  useEffect(() => {
    localStorage.setItem('sidebar_swapped', String(sidebarSwapped));
  }, [sidebarSwapped]);

  useEffect(() => {
    localStorage.setItem('left_width', String(leftWidth));
  }, [leftWidth]);

  useEffect(() => {
    localStorage.setItem('right_width', String(rightWidth));
  }, [rightWidth]);

  const startLeftResize = useCallback((e: React.MouseEvent) => {

    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setLeftWidth(Math.max(320, Math.min(800, newWidth)));
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [leftWidth]);

  const startRightResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth - (moveEvent.clientX - startX);
      setRightWidth(Math.max(384, Math.min(800, newWidth)));
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [rightWidth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const cleanString = (text: string) => {
    if (!autoOptimize) return text;
    return text
      .split('\n')
      .map(line => 
        line
          .replace(/[\u3000]/g, ' ')
          .replace(/[ \t]+/g, ' ')
          .replace(/[ \t]+,/g, ',')
          .replace(/,+/g, ',')
          .replace(/,[ \t]*,/g, ',')
          .replace(/,([^\s])/g, ', $1')
          .trim()
      )
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^[\s,]+|[\s,]+$/g, '')
      .trim();
  };

  const handleTogglePart = (id: string) => {
    const part = data.parts.find(p => p.id === id);
    if (!part) return;

    const insert = (prev: string, pos: number | null, setPos: (p: number) => void) => {
      const actualPos = pos === null ? prev.length : pos;
      const before = prev.slice(0, actualPos);
      const after = prev.slice(actualPos);
      const prefix = autoOptimize && before.length > 0 && !before.endsWith(', ') && !before.endsWith(',') && !before.endsWith(' ') && !before.endsWith('\n') ? ', ' : '';
      const suffix = autoOptimize && after.length > 0 && !after.startsWith(',') && !after.startsWith(' ') && !after.startsWith('\n') ? ', ' : '';
      const insertedStr = prefix + part.content + suffix;
      setPos(actualPos + insertedStr.length);
      return cleanString(before + insertedStr + after);
    };
    
    if (activeEditor === 'negative') {
      setNegativeEditorText(prev => insert(prev, negativeCursorPos, setNegativeCursorPos as any));
    } else {
      setEditorText(prev => insert(prev, positiveCursorPos, setPositiveCursorPos as any));
    }
  };

  const handleTogglePin = (id: string) => {
    setData((prev) => ({
      ...prev,
      parts: prev.parts.map((p) =>
        p.id === id ? { ...p, isPinned: !p.isPinned } : p
      ),
    }));
  };

  const handleUpdateMaster = (id: string, updates: Partial<MasterPrompt>) => {
    setData(prev => ({ ...prev, masters: prev.masters.map(m => m.id === id ? { ...m, ...updates } : m) }));
  };

  const handleDeleteMaster = (id: string) => {
    setData(prev => ({ ...prev, masters: prev.masters.filter(m => m.id !== id) }));
    if (selectedMasterId === id) setSelectedMasterId(null);
  };

  const handleDeleteBulkMaster = (ids: string[]) => {
    setData(prev => ({ ...prev, masters: prev.masters.filter(m => !ids.includes(m.id)) }));
    if (selectedMasterId && ids.includes(selectedMasterId)) setSelectedMasterId(null);
  };

  const handleAddMaster = (name: string = 'NEW_MASTER', content: string = 'new content') => {
    const newMaster: MasterPrompt = { id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name, content };
    setData(prev => ({ ...prev, masters: [newMaster, ...prev.masters] }));
  };

  const handleUpdateNegative = (id: string, updates: Partial<MasterPrompt>) => {
    setData(prev => ({ ...prev, negatives: (prev.negatives || []).map(m => m.id === id ? { ...m, ...updates } : m) }));
  };

  const handleDeleteNegative = (id: string) => {
    setData(prev => ({ ...prev, negatives: (prev.negatives || []).filter(m => m.id !== id) }));
    if (selectedNegativeId === id) setSelectedNegativeId(null);
  };

  const handleDeleteBulkNegative = (ids: string[]) => {
    setData(prev => ({ ...prev, negatives: (prev.negatives || []).filter(m => !ids.includes(m.id)) }));
    if (selectedNegativeId && ids.includes(selectedNegativeId)) setSelectedNegativeId(null);
  };

  const handleAddNegative = (name: string = 'NEW_NEGATIVE', content: string = 'new negative content') => {
    const newNegative: MasterPrompt = { id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name, content };
    setData(prev => ({ ...prev, negatives: [newNegative, ...(prev.negatives || [])] }));
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Map<string, number>(); // category -> section
    data.parts.forEach(p => cats.set(p.category, p.section));
    return Array.from(cats.entries());
  }, [data.parts]);

  const handleSaveAsMaster = (name: string, content: string, isNegative: boolean) => {
    if (isNegative) {
      handleAddNegative(name, content);
    } else {
      handleAddMaster(name, content);
    }
  };

  const handleReorderNegatives = (startIndex: number, endIndex: number) => {
    setData(prev => {
      const newNegatives = Array.from(prev.negatives || []);
      const [removed] = newNegatives.splice(startIndex, 1);
      newNegatives.splice(endIndex, 0, removed);
      return { ...prev, negatives: newNegatives };
    });
  };

  const moveItems = (list: any[], ids: string[], direction: 'top' | 'up' | 'down' | 'bottom') => {
    const selectedSet = new Set(ids);
    const selectedItems = list.filter(item => selectedSet.has(item.id));
    const unselectedItems = list.filter(item => !selectedSet.has(item.id));
    
    if (selectedItems.length === 0) return list;

    if (direction === 'top') {
      return [...selectedItems, ...unselectedItems];
    }
    if (direction === 'bottom') {
      return [...unselectedItems, ...selectedItems];
    }
    
    const newList = [...list];
    if (direction === 'up') {
      for (let i = 1; i < newList.length; i++) {
        if (selectedSet.has(newList[i].id) && !selectedSet.has(newList[i-1].id)) {
          const temp = newList[i-1];
          newList[i-1] = newList[i];
          newList[i] = temp;
        }
      }
    } else if (direction === 'down') {
      for (let i = newList.length - 2; i >= 0; i--) {
        if (selectedSet.has(newList[i].id) && !selectedSet.has(newList[i+1].id)) {
          const temp = newList[i+1];
          newList[i+1] = newList[i];
          newList[i] = temp;
        }
      }
    }
    return newList;
  };

  const handleMoveBulkMasters = (ids: string[], direction: 'top' | 'up' | 'down' | 'bottom') => {
    setData(prev => ({
      ...prev,
      masters: moveItems(prev.masters, ids, direction)
    }));
  };

  const handleMoveBulkNegatives = (ids: string[], direction: 'top' | 'up' | 'down' | 'bottom') => {
    setData(prev => ({
      ...prev,
      negatives: moveItems(prev.negatives || [], ids, direction)
    }));
  };

  const handleUpdatePart = (id: string, updates: Partial<VariationPart>) => {
    setData(prev => ({ ...prev, parts: prev.parts.map(p => p.id === id ? { ...p, ...updates } : p) }));
  };

  const handleDeletePart = (id: string) => {
    setData(prev => ({ ...prev, parts: prev.parts.filter(p => p.id !== id) }));
    if (selectedPartIds.has(id)) handleTogglePart(id);
  };

  const handleAddPart = (category: string, section: number, name: string = 'NEW_PART', content: string = 'new content') => {
    const newPart: VariationPart = { id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name, content, category, section: section as 1 | 2 | 3 | 4, isPinned: false };
    setData(prev => ({ ...prev, parts: [newPart, ...prev.parts] }));
  };

  const handleReorderMasters = (startIndex: number, endIndex: number) => {
    setData(prev => {
      const newMasters = Array.from(prev.masters);
      const [removed] = newMasters.splice(startIndex, 1);
      newMasters.splice(endIndex, 0, removed);
      return { ...prev, masters: newMasters };
    });
  };

  const handleReorderParts = (draggedId: string, targetId: string) => {
    setData(prev => {
      const draggedIndex = prev.parts.findIndex(p => p.id === draggedId);
      const targetIndex = prev.parts.findIndex(p => p.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return prev;
      
      const newParts = Array.from(prev.parts);
      const [removed] = newParts.splice(draggedIndex, 1);
      newParts.splice(targetIndex, 0, removed);

      return { ...prev, parts: newParts };
    });
  };


  const handleExport = async () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    
    // Sanitize data before export
    const cleanedData = {
      ...data,
      masters: data.masters.map(m => ({ ...m, content: cleanString(m.content) })),
      negatives: data.negatives?.map(n => ({ ...n, content: cleanString(n.content) })),
      parts: data.parts.map(p => ({ ...p, content: cleanString(p.content) }))
    };

    const exportData = {
      title: "Solid Square Prompt Mixer",
      exportDate: formattedDate,
      ...cleanedData
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    const fallbackDownload = () => {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Solid_Square_Prompt_Mixer_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    if ('showSaveFilePicker' in window && window.self === window.top) {
      try {
        let dirHandle = await getFileHandle('export_directory');
        let fileHandle = null;
        let hasDirPermission = false;

        if (dirHandle) {
          const permission = await dirHandle.queryPermission({ mode: 'readwrite' });
          if (permission === 'granted') {
            hasDirPermission = true;
          } else {
            const request = await dirHandle.requestPermission({ mode: 'readwrite' });
            if (request === 'granted') {
              hasDirPermission = true;
            }
          }
        }

        if (hasDirPermission && dirHandle) {
           fileHandle = await dirHandle.getFileHandle(`Solid_Square_Prompt_Mixer_${dateStr}.json`, { create: true });
        } else {
           // Fallback to showSaveFilePicker if no directory handle
           fileHandle = await (window as any).showSaveFilePicker({
             id: 'prompt_mixer_export',
             suggestedName: `Solid_Square_Prompt_Mixer_${dateStr}.json`,
             types: [{
               description: 'JSON Files',
               accept: { 'application/json': ['.json'] },
             }],
           });
        }

        if (fileHandle) {
          const writable = await fileHandle.createWritable();
          await writable.write(jsonString);
          await writable.close();
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('File System API Error:', err);
          fallbackDownload();
        }
      }
    } else {
      fallbackDownload();
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.masters && parsed.parts) {
          setData(parsed);
          setSelectedMasterId(parsed.masters[0]?.id || null);
        } else {
          alert('Invalid JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  const handleSelectMasterId = (id: string | null, insert: boolean = true) => {
    if (id && insert) {
      const newMaster = data.masters.find(m => m.id === id);
      if (newMaster) {
        let newPos = 0;
        setEditorText(prev => {
          const actualPos = positiveCursorPos === null ? prev.length : positiveCursorPos;
          const before = prev.slice(0, actualPos);
          const after = prev.slice(actualPos);
          const prefix = autoOptimize && before.length > 0 && !before.endsWith(', ') && !before.endsWith(',') && !before.endsWith(' ') && !before.endsWith('\n') ? ', ' : '';
          const suffix = autoOptimize && after.length > 0 && !after.startsWith(',') && !after.startsWith(' ') && !after.startsWith('\n') ? ', ' : '';
          const insertedStr = prefix + newMaster.content + suffix;
          newPos = actualPos + insertedStr.length;
          return cleanString(before + insertedStr + after);
        });
        setTimeout(() => setPositiveCursorPos(newPos), 0);
      }
    }
    setSelectedMasterId(id);
  };

  const handleSelectNegativeId = (id: string | null, insert: boolean = true) => {
    if (id && insert) {
      const newNeg = data.negatives?.find(m => m.id === id);
      if (newNeg) {
        let newPos = 0;
        setNegativeEditorText(prev => {
          const actualPos = negativeCursorPos === null ? prev.length : negativeCursorPos;
          const before = prev.slice(0, actualPos);
          const after = prev.slice(actualPos);
          const prefix = autoOptimize && before.length > 0 && !before.endsWith(', ') && !before.endsWith(',') && !before.endsWith(' ') && !before.endsWith('\n') ? ', ' : '';
          const suffix = autoOptimize && after.length > 0 && !after.startsWith(',') && !after.startsWith(' ') && !after.startsWith('\n') ? ', ' : '';
          const insertedStr = prefix + newNeg.content + suffix;
          newPos = actualPos + insertedStr.length;
          return cleanString(before + insertedStr + after);
        });
        setTimeout(() => setNegativeCursorPos(newPos), 0);
      }
    }
    setSelectedNegativeId(id);
  };

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden bg-bg-base transition-colors duration-300`} style={{ zoom: 1 }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border-main bg-bg-panel h-14 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-text-main rounded-full opacity-80"></div>
            <h1 className="font-mono font-bold text-lg tracking-widest text-text-main">{t('app_title', lang)}</h1>
          </div>
          <div className="h-4 w-px bg-border-main"></div>
          <span className="text-[10px] font-mono opacity-50 text-text-main">{t('local_system_ready', lang)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSidebarSwapped(s => !s)}
            className="bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded px-2 py-1 outline-none mr-2 transition-colors flex items-center justify-center"
            title="Swap Sidebars"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'black' : t === 'black' ? 'red' : t === 'red' ? 'light' : t === 'light' ? 'navy' : 'dark')}
            className="bg-bg-input hover:bg-border-main border border-border-main text-[10px] font-mono text-text-main rounded px-3 py-1 outline-none mr-2 transition-colors flex items-center h-[26px]"
          >
            {t('theme', lang)}: {t(`theme_${theme}` as keyof typeof translations, lang)}
          </button>
          <button 
            onClick={() => setPaperMode(!paperMode)}
            className={`text-[10px] font-mono border rounded px-3 py-1 outline-none mr-4 transition-colors flex items-center h-[26px] ${paperMode ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-bg-input hover:bg-border-main border-border-main text-text-dim'}`}
          >
            {t('paper_mode', lang)}: {paperMode ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => setLang(l => l === 'en' ? 'ja' : 'en')}
            className="flex items-center px-3 h-[26px] bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-main rounded text-text-dim transition-colors"
          >
            {lang === 'en' ? 'JP' : 'EN'}
          </button>
        </div>
      </header>

      {/* Main Layout (3 Columns: Master -> Editor <- Variations) */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {isLeftOpen && (
          <aside style={{ width: leftWidth }} className="border-r border-border-main bg-bg-panel flex flex-col shrink-0 relative">
            {sidebarSwapped ? (
            <VariationColumn
              parts={data.parts}
              selectedIds={selectedPartIds}
              onTogglePart={handleTogglePart}
              onTogglePin={handleTogglePin}
              onAdd={handleAddPart}
              onUpdate={handleUpdatePart}
              onDelete={handleDeletePart}
              onReorder={handleReorderParts}
              onCopyToMaster={(part) => setSaveMasterFromPartData({ name: part.name, content: part.content })}
              onCopyBulkToMaster={(items) => setSaveMasterFromPartData({ items: items.map(i => ({name: i.name, content: i.content})) })}
              lang={lang}
            />
          ) : (
            <MasterColumn
              masters={data.masters}
              negatives={data.negatives}
              selectedId={selectedMasterId}
              selectedNegativeId={selectedNegativeId}
              onSelect={handleSelectMasterId}
              onSelectNegative={handleSelectNegativeId}
              onAdd={handleAddMaster}
              onAddNegative={handleAddNegative}
              onUpdate={handleUpdateMaster}
              onUpdateNegative={handleUpdateNegative}
              onDelete={handleDeleteMaster}
              onDeleteNegative={handleDeleteNegative}
              onDeleteBulk={handleDeleteBulkMaster}
              onDeleteBulkNegative={handleDeleteBulkNegative}
              onMoveBulk={handleMoveBulkMasters}
              onMoveBulkNegative={handleMoveBulkNegatives}
              onReorder={handleReorderMasters}
              onReorderNegative={handleReorderNegatives}
              onCopyToPart={(item) => setSavePartFromMasterData({ name: item.name, content: item.content })}
              onCopyBulkToPart={(items) => setSavePartFromMasterData({ items: items.map(i => ({name: i.name, content: i.content})) })}
              activeTab={activeMasterTab}
              setActiveTab={setActiveMasterTab}
              lang={lang}
            />
          )}

          <div className="p-3 border-t border-border-main flex flex-col gap-2 shrink-0">
            <div className="bg-bg-input border border-border-main rounded p-2 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-text-main font-bold tracking-widest">08 DRIVE 保存先</span>
                <div className="flex space-x-1">
                  <button onClick={handleChangeExportDir} className="text-[10px] font-mono text-text-main font-bold hover:text-accent-main transition-colors">変更</button>
                  {exportDirectoryName && (
                    <button onClick={handleClearExportDir} className="text-[10px] font-mono text-text-main font-bold hover:text-accent-main transition-colors">(CLEAR)</button>
                  )}
                </div>
              </div>
              <button 
                onClick={handleChangeExportDir}
                className="w-full text-center px-2 py-1.5 bg-bg-panel hover:bg-border-main border border-border-main rounded text-[10px] font-mono text-text-main truncate transition-colors"
              >
                {exportDirectoryName || '未設定 (設定するにはクリック)'}
              </button>
            </div>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center px-2 py-1.5 bg-border-main hover:bg-border-hover text-[10px] font-mono border border-border-hover rounded transition-colors cursor-pointer text-text-main">
                {t('import_json', lang)}
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
              <button onClick={handleExport} className="flex-1 flex items-center justify-center px-2 py-1.5 bg-accent-main hover:opacity-80 text-[10px] font-mono border border-accent-dim rounded text-text-main transition-opacity cursor-pointer">
                {t('export_config', lang)}
              </button>
            </div>
          </div>

          <div 
            onMouseDown={startLeftResize}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-accent-main active:bg-accent-main transition-colors z-10"
          />
        </aside>
        )}

        <button 
          onClick={() => setIsLeftOpen(!isLeftOpen)}
          className="self-center shrink-0 z-20 flex items-center justify-center w-5 h-24 bg-bg-panel hover:bg-bg-input text-text-main border border-border-main border-l-0 shadow-md rounded-r-md transition-colors"
        >
          {isLeftOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Center: Text Editor & Output */}
        <section className="flex-1 flex flex-col bg-bg-base relative min-w-0">
          <PreviewColumn
            editorText={editorText}
            setEditorText={setEditorText}
            negativeEditorText={negativeEditorText}
            setNegativeEditorText={setNegativeEditorText}
            activeEditor={activeEditor}
            setActiveEditor={setActiveEditor}
            setPositiveCursorPos={setPositiveCursorPos}
            setNegativeCursorPos={setNegativeCursorPos}
            onSaveAsMaster={handleSaveAsMaster}
            onSaveAsPart={(name, content, category, section, items) => {
              if (items && items.length > 0) {
                setData(prev => {
                  const newParts: VariationPart[] = items.map((item, i) => ({
                    id: `p_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                    name: item.name,
                    content: item.content,
                    category,
                    section: section as 1 | 2 | 3 | 4,
                    isPinned: false
                  }));
                  return { ...prev, parts: [...newParts, ...prev.parts] };
                });
              } else {
                handleAddPart(category, section, name, content);
              }
            }}
            uniqueCategories={uniqueCategories}
            activeMasterTab={activeMasterTab}
            lang={lang}
            paperMode={paperMode}
            theme={theme}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            autoOptimize={autoOptimize}
            onToggleAutoOptimize={() => setAutoOptimize(!autoOptimize)}
          />
        </section>

        <SavePartModal
          isOpen={savePartFromMasterData !== null}
          content={savePartFromMasterData?.content || ''}
          defaultName={savePartFromMasterData?.name || ''}
          items={savePartFromMasterData?.items}
          categories={uniqueCategories}
          onConfirm={(name, category, section, items) => {
            if (items && items.length > 0) {
              items.forEach(item => {
                handleAddPart(category, section, item.name, item.content);
              });
            } else {
              handleAddPart(category, section, name, savePartFromMasterData?.content || '');
            }
            setSavePartFromMasterData(null);
          }}
          onCancel={() => setSavePartFromMasterData(null)}
          lang={lang}
        />

        <SaveMasterModal
          isOpen={saveMasterFromPartData !== null}
          content={saveMasterFromPartData?.content || ''}
          defaultTitle={saveMasterFromPartData?.name || ''}
          items={saveMasterFromPartData?.items}
          isNegative={activeMasterTab === 'negative'}
          onConfirm={(title, content, isNegative, items) => {
            if (items && items.length > 0) {
              items.forEach(item => {
                handleSaveAsMaster(item.name, item.content, isNegative);
              });
            } else {
              handleSaveAsMaster(title, content, isNegative);
            }
            setSaveMasterFromPartData(null);
          }}
          onCancel={() => setSaveMasterFromPartData(null)}
          lang={lang}
        />

        <button 
          onClick={() => setIsRightOpen(!isRightOpen)}
          className="self-center shrink-0 z-20 flex items-center justify-center w-5 h-24 bg-bg-panel hover:bg-bg-input text-text-main border border-border-main border-r-0 shadow-md rounded-l-md transition-colors"
        >
          {isRightOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Right Sidebar */}
        {isRightOpen && (
          <aside style={{ width: rightWidth }} className="border-l border-border-main bg-bg-panel flex flex-col shrink-0 relative">
            <div 
              onMouseDown={startRightResize}
              className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-accent-main active:bg-accent-main transition-colors z-10 -ml-[0.5px]"
            />
          {sidebarSwapped ? (
            <MasterColumn
              masters={data.masters}
              negatives={data.negatives}
              selectedId={selectedMasterId}
              selectedNegativeId={selectedNegativeId}
              onSelect={handleSelectMasterId}
              onSelectNegative={handleSelectNegativeId}
              onAdd={handleAddMaster}
              onAddNegative={handleAddNegative}
              onUpdate={handleUpdateMaster}
              onUpdateNegative={handleUpdateNegative}
              onDelete={handleDeleteMaster}
              onDeleteNegative={handleDeleteNegative}
              onDeleteBulk={handleDeleteBulkMaster}
              onDeleteBulkNegative={handleDeleteBulkNegative}
              onMoveBulk={handleMoveBulkMasters}
              onMoveBulkNegative={handleMoveBulkNegatives}
              onReorder={handleReorderMasters}
              onReorderNegative={handleReorderNegatives}
              onCopyToPart={(item) => setSavePartFromMasterData({ name: item.name, content: item.content })}
              onCopyBulkToPart={(items) => setSavePartFromMasterData({ items: items.map(i => ({name: i.name, content: i.content})) })}
              activeTab={activeMasterTab}
              setActiveTab={setActiveMasterTab}
              lang={lang}
            />
          ) : (
            <VariationColumn
              parts={data.parts}
              selectedIds={selectedPartIds}
              onTogglePart={handleTogglePart}
              onTogglePin={handleTogglePin}
              onAdd={handleAddPart}
              onUpdate={handleUpdatePart}
              onDelete={handleDeletePart}
              onReorder={handleReorderParts}
              onCopyToMaster={(part) => setSaveMasterFromPartData({ name: part.name, content: part.content })}
              onCopyBulkToMaster={(items) => setSaveMasterFromPartData({ items: items.map(i => ({name: i.name, content: i.content})) })}
              lang={lang}
            />
          )}
          </aside>
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="h-8 border-t border-border-main bg-bg-panel flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <span className="text-[9px] font-mono text-green-500">● {t('local_system_ready', lang)}</span>
          <span className="text-[9px] font-mono text-text-dim">{t('latency', lang)}: 0.04ms</span>
        </div>
        <div className="flex space-x-4">
          <span className="text-[9px] font-mono text-text-dim uppercase">{t('cpu', lang)}: 12%</span>
          <span className="text-[9px] font-mono text-text-dim uppercase">{t('mem', lang)}: 1.4GB</span>
          <span className="text-[9px] font-mono text-text-main">{new Date().toISOString().slice(0, 19).replace('T', ' ')}</span>
        </div>
      </footer>
      {iframeWarning && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-panel border border-border-main p-6 rounded-lg max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-bold text-text-main mb-4 uppercase">機能制限のお知らせ</h3>
            <p className="text-xs text-text-main leading-relaxed mb-6">
              AI Studioのプレビュー画面（iframe）の中では、セキュリティの制限によりフォルダを選択するダイアログを表示することができません。
              <br/><br/>
              右上の「新しいタブで開く」アイコン（矢印のマーク）をクリックして、<strong>新しいタブでアプリを開き直してから</strong>、再度設定をお試しください。
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIframeWarning(false)}
                className="px-4 py-2 bg-accent-main text-text-main text-xs rounded hover:opacity-80 transition-opacity"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
