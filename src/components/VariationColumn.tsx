import React, { useMemo, useState, useEffect } from 'react';
import { VariationPart } from '../types';
import { Accordion } from './Accordion';
import { ConfirmModal } from './ConfirmModal';
import { AddModal } from './AddModal';
import { User, Pencil, Trash2, Check, X, Plus, ChevronUp, ChevronDown, ChevronRight, ChevronsUp, ChevronsDown, ArrowLeftToLine, ArrowRightToLine, Copy, Pin, Upload, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, t } from '../i18n';
import { AttributeMixer } from './AttributeMixer';
import { DuplicateSearchModal } from './DuplicateSearchModal';
import { Search, Combine, MoreHorizontal } from 'lucide-react';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { getOrderedCategories, getSectionDisplayName } from '../utils/categoryUtils';

interface VariationColumnProps {
  parts: VariationPart[];
  customCategories?: { name: string, section: number }[];
  customSectionNames?: Record<number, string>;
  onRenameSection?: (section: number, newName: string) => void;
  selectedIds: Set<string>;
  onTogglePart: (id: string) => void;
  onTogglePin: (id: string) => void;
  onTogglePartNegative?: (id: string) => void;
  onAdd: (category: string, section: number, name: string, content?: string) => void;
  onUpdate: (id: string, updates: Partial<VariationPart>) => void;
  onDuplicate?: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteBulk?: (ids: string[]) => void;
  onDeleteAll?: () => void;
  onAddCategory?: (section: number, name: string) => void;
  onRenameCategory?: (section: number, oldName: string, newName: string) => void;
  onDeleteCategory?: (section: number, name: string) => void;
  onReorderCategory?: (draggedSection: number, draggedCat: string, targetSection: number, targetCat?: string) => void;
  onReorder?: (draggedId: string, targetId: string) => void;
  onCopyToMaster?: (part: VariationPart) => void;
  onCopyToMixer?: (part: VariationPart) => void;
  onCopyBulkToMaster?: (items: VariationPart[]) => void;
  onCopyBulkToMixer?: (items: VariationPart[]) => void;
  onMixAttributes?: (pos: string, neg: string) => void;
  onInsertText?: (text: string, isNegative?: boolean) => void;
  onCopyToParts?: (parts: VariationPart[], categories: { name: string, section: number }[]) => { added: number, skipped: number };
  lang: Language;
  theme: string;
  activeTab?: 'parts' | 'mixer';
  setActiveTab?: (tab: 'parts' | 'mixer') => void;
  onExport?: () => void;
  onImportFileSelect?: (file: File) => void;
  children?: React.ReactNode;
}

export const VariationColumn: React.FC<VariationColumnProps> = ({ 
  parts, customCategories = [], customSectionNames = {}, onRenameSection, selectedIds, onTogglePart, onTogglePin, onTogglePartNegative, onAdd, onUpdate, onDuplicate, onDelete, onDeleteBulk, onDeleteAll, onAddCategory, onRenameCategory, onDeleteCategory, onReorderCategory, onReorder, onCopyToMaster, onCopyToMixer, onCopyBulkToMaster, onCopyBulkToMixer, onMixAttributes, onInsertText, onCopyToParts, lang, theme, activeTab = 'parts', setActiveTab, onExport, onImportFileSelect, children
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editSectionName, setEditSectionName] = useState('');
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [draggedPart, setDraggedPart] = useState<{ id: string, category: string } | null>(null);
  const [copiedPartId, setCopiedPartId] = useState<string | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<{ name: string, section: number } | null>(null);
  const [draggedSection, setDraggedSection] = useState<number | null>(null);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmQuickDeleteId, setConfirmQuickDeleteId] = useState<string | null>(null);
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [confirmAddData, setConfirmAddData] = useState<{ category: string, section: number } | null>(null);
  const [confirmAddCategoryData, setConfirmAddCategoryData] = useState<number | null>(null);
  const [confirmDeleteCategoryData, setConfirmDeleteCategoryData] = useState<{ section: number, name: string } | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [confirmDeleteAllState, setConfirmDeleteAllState] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{message: string, action: () => void} | null>(null);

  const [sectionOrder, setSectionOrder] = useState<number[]>(() => {
    const saved = localStorage.getItem('variation_section_order');
    let parsed = saved ? JSON.parse(saved) : [1, 2, 3, 4, 5];
    if (!parsed.includes(5)) parsed.push(5);
    return parsed;
  });

  const uniqueCategories = useMemo(() => {
    return getOrderedCategories(parts, customCategories, sectionOrder);
  }, [parts, customCategories, sectionOrder]);

  const handleBulkMove = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    
    if (val === 'copy_to_master') {
      if (onCopyBulkToMaster) {
        const itemsToCopy = parts.filter(p => bulkSelectedIds.has(p.id));
        onCopyBulkToMaster(itemsToCopy);
      }
      setBulkSelectedIds(new Set());
      e.target.value = ''; // reset
      return;
    }
    
    if (val === 'copy_to_mixer') {
      if (onCopyBulkToMixer) {
        const itemsToCopy = parts.filter(p => bulkSelectedIds.has(p.id));
        onCopyBulkToMixer(itemsToCopy);
      }
      setBulkSelectedIds(new Set());
      e.target.value = ''; // reset
      return;
    }

    const [sectionStr, ...catParts] = val.split(':');
    const category = catParts.join(':');
    const section = Number(sectionStr);
    
    bulkSelectedIds.forEach(id => {
      onUpdate(id, { category, section: section as 1|2|3|4|5 });
    });
    setBulkSelectedIds(new Set());
    e.target.value = ''; // reset
  };

  const handleBulkDelete = () => {
    setConfirmBulkDelete(true);
  };

  const confirmBulkDeleteExecute = () => {
    bulkSelectedIds.forEach(id => onDelete(id));
    setBulkSelectedIds(new Set());
    setConfirmBulkDelete(false);
  };

  const handleToggleBulkSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBulkSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };


  const handleSectionDragStart = (e: React.DragEvent, sectionId: number) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };
  const handleSectionDragEnd = (e: React.DragEvent) => {
    setDraggedSection(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };
  const handleSectionDragOver = (e: React.DragEvent, targetSectionId: number) => {
    e.preventDefault();
    if (draggedCategory) { e.dataTransfer.dropEffect = 'move'; return; }
    if (draggedSection !== null && draggedSection !== targetSectionId) {
      setSectionOrder(prev => {
        const fromIdx = prev.indexOf(draggedSection);
        const toIdx = prev.indexOf(targetSectionId);
        if (fromIdx < 0 || toIdx < 0) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        localStorage.setItem('variation_section_order', JSON.stringify(next));
        window.dispatchEvent(new Event('variation_section_order_updated'));
        return next;
      });
    }
  };

  const handleCatDragStart = (e: React.DragEvent, name: string, section: number) => {
    e.stopPropagation();
    setDraggedCategory({ name, section });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };
  const handleCatDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedCategory(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleSectionContainerDrop = (e: React.DragEvent, section: number) => {
    e.preventDefault();
    if (!draggedCategory) return;
    if (draggedCategory.section === section) return;
    if (onReorderCategory) {
      onReorderCategory(draggedCategory.section, draggedCategory.name, section);
    }
  };

  const handleCatDragOver = (e: React.DragEvent, section: number) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleCatDrop = (e: React.DragEvent, targetName: string, section: number) => {
    e.preventDefault();
    if (!draggedCategory || (draggedCategory.section === section && draggedCategory.name === targetName)) return;
    if (onReorderCategory) {
      onReorderCategory(draggedCategory.section, draggedCategory.name, section, targetName);
    }
  };

  const handleSectionDrop = (e: React.DragEvent, section: number) => {
    e.preventDefault();
    if (!draggedCategory || draggedCategory.section === section) return;
    if (onReorderCategory) {
      onReorderCategory(draggedCategory.section, draggedCategory.name, section);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string, category: string) => {
    e.stopPropagation();
    setDraggedPart({ id, category });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedPart(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (draggedPart?.category === category) {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDrop = (e: React.DragEvent, id: string, category: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!draggedPart || draggedPart.category !== category || draggedPart.id === id) return;
    if (onReorder) {
      onReorder(draggedPart.id, id);
    }
  };

  const filteredParts = useMemo(() => {
    if (!searchQuery.trim()) return parts;
    const query = searchQuery.toLowerCase();
    return parts.filter(
      (p) => p.name.toLowerCase().includes(query) || p.content.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  }, [parts, searchQuery]);

  const [expandId, setExpandId] = useState(0);
  const [collapseId, setCollapseId] = useState(0);

  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('variation_collapsed_sections');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('variation_collapsed_sections', JSON.stringify(collapsedSections));
  }, [collapsedSections]);

  const [expandLevel, setExpandLevel] = useState<number>(() => {
    const saved = localStorage.getItem('variation_collapsed_sections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const allClosed = [1, 2, 3, 4, 5].every(id => parsed[id]);
        if (allClosed) return 0;
      } catch (e) {}
    }
    return 1;
  });

  const toggleSectionCollapse = (secId: number) => {
    setCollapsedSections(prev => {
      const next = { ...prev, [secId]: !prev[secId] };
      const allClosed = sectionOrder.every(id => next[id]);
      const noneClosed = sectionOrder.every(id => !next[id]);
      if (allClosed) {
        setExpandLevel(0);
      } else if (noneClosed && expandLevel === 0) {
        setExpandLevel(1);
      }
      return next;
    });
  };

  const handleExpandNext = () => {
    if (expandLevel === 0) {
      setCollapsedSections({});
      setCollapseId(prev => prev + 1);
      setExpandLevel(1);
    } else if (expandLevel === 1) {
      setCollapsedSections({});
      setExpandId(prev => prev + 1);
      setExpandLevel(2);
    } else {
      const allCollapsed: Record<number, boolean> = {};
      sectionOrder.forEach(secId => {
        allCollapsed[secId] = true;
      });
      setCollapsedSections(allCollapsed);
      setCollapseId(prev => prev + 1);
      setExpandLevel(0);
    }
  };

  const handleCollapsePrev = () => {
    if (expandLevel === 2) {
      setCollapsedSections({});
      setCollapseId(prev => prev + 1);
      setExpandLevel(1);
    } else {
      const allCollapsed: Record<number, boolean> = {};
      sectionOrder.forEach(secId => {
        allCollapsed[secId] = true;
      });
      setCollapsedSections(allCollapsed);
      setCollapseId(prev => prev + 1);
      setExpandLevel(0);
    }
  };

  const getSectionBorderBar = (secId: string) => {
    switch (secId) {
      case '1': return 'border-l-blue-500';
      case '2': return 'border-l-orange-500';
      case '3': return 'border-l-green-500';
      case '4': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };
  
  useEffect(() => {
    const handleImport = () => {
      const saved = localStorage.getItem('variation_section_order');
      if (saved) {
        try { 
          let parsed = JSON.parse(saved); 
          if (!parsed.includes(5)) parsed.push(5);
          setSectionOrder(parsed); 
        } catch (e) {}
      }
    };
    window.addEventListener('attributeMixerDataImported', handleImport);
    return () => window.removeEventListener('attributeMixerDataImported', handleImport);
  }, []);
  
  const moveSection = (secId: number, direction: 'up' | 'down') => {
    setSectionOrder(prev => {
      const idx = prev.indexOf(secId);
      if (idx < 0) return prev;
      const next = [...prev];
      if (direction === 'up' && idx > 0) {
        [next[idx-1], next[idx]] = [next[idx], next[idx-1]];
      } else if (direction === 'down' && idx < prev.length - 1) {
        [next[idx+1], next[idx]] = [next[idx], next[idx+1]];
      }
      localStorage.setItem('variation_section_order', JSON.stringify(next));
      window.dispatchEvent(new Event('variation_section_order_updated'));
      return next;
    });
  };


  // Group by Section, then Category
  const groupedParts = useMemo(() => {
    const sections = {
      1: { name: customSectionNames[1] || t('sec_composition' as any, lang), categories: {} as Record<string, VariationPart[]> },
      2: { name: customSectionNames[2] || t('sec_pose' as any, lang), categories: {} as Record<string, VariationPart[]> },
      3: { name: customSectionNames[3] || t('sec_details' as any, lang), categories: {} as Record<string, VariationPart[]> },
      4: { name: customSectionNames[4] || t('sec_context' as any, lang), categories: {} as Record<string, VariationPart[]> },
      5: { name: customSectionNames[5] || t('sec_others' as any, lang), categories: {} as Record<string, VariationPart[]> },
    };

    customCategories.forEach(cat => {
      const sec = sections[cat.section as 1 | 2 | 3 | 4 | 5];
      if (sec && !sec.categories[cat.name]) {
        sec.categories[cat.name] = [];
      }
    });

    filteredParts.forEach((part) => {
      const sec = sections[part.section as 1 | 2 | 3 | 4 | 5] || sections[5]; // Fallback to 5 (Others)
      if (!sec) return;
      if (!sec.categories[part.category]) {
        sec.categories[part.category] = [];
      }
      sec.categories[part.category].push(part);
    });

    // Sorting removed so users can fully freely reorder items including pinned ones
    return sections;
  }, [filteredParts, customCategories, customSectionNames, lang]);

  const startEdit = (part: VariationPart, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(part.id);
    setEditName(part.name);
    setEditContent(part.content);
    setEditCategory(part.category);
  };

  const handleSave = (id: string) => {
    onUpdate(id, { name: editName, content: editContent, category: editCategory });
    setEditingId(null);
  };

  return (
    <>
      <div className="p-2 bg-bg-panel border-b border-border-main shrink-0 overflow-x-auto">
        <div className="flex w-full gap-1.5 bg-bg-panel text-[10px] font-mono uppercase tracking-widest">
          <button 
            onClick={() => setActiveTab?.('parts')}
            className={`flex-1 flex justify-center items-center gap-1 py-1.5 px-2 border font-mono font-bold whitespace-nowrap transition-colors ${activeTab === 'parts' ? 'bg-text-main text-bg-base border-text-main' : 'bg-bg-input text-text-dim border-border-main hover:text-text-main hover:bg-bg-surface'}`}
          >
            {t('variation_parts', lang)}
          </button>
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('mixer')}
              className={`flex-1 flex justify-center items-center gap-1 py-1.5 px-2 border font-mono font-bold whitespace-nowrap transition-colors ${activeTab === 'mixer' ? 'btn-peper-orange bg-text-main text-bg-base border-text-main' : 'bg-bg-input text-text-dim border-border-main hover:text-text-main hover:bg-bg-surface'}`}
            >
              <User size={12} /> {t('prompt_mixer', lang)}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2 bg-bg-panel border-b border-border-main shrink-0">
        <div className="flex items-center justify-between text-[10px] font-mono w-full">
          <div className="flex-1 text-text-dim flex items-center font-bold tracking-wider">
            {activeTab === 'parts' ? t('variation_parts', lang) : t('prompt_mixer', lang)}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onImportFileSelect && (
              <label 
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-bg-surface border border-border-main text-text-dim hover:text-text-main text-[10px] font-mono font-bold cursor-pointer transition-colors"
                title={lang === 'en' ? 'Import (Parts & Mixer)' : 'インポート'}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('import_json', lang)}</span>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && onImportFileSelect) onImportFileSelect(f);
                    e.target.value = '';
                  }} 
                />
              </label>
            )}
            {onExport && (
              <button 
                type="button"
                onClick={onExport}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-bg-surface border border-border-main text-text-dim hover:text-text-main text-[10px] font-mono font-bold transition-colors"
                title={lang === 'en' ? 'Export (Parts & Mixer)' : 'エクスポート'}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('export_config', lang)}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'parts' ? (
      <>
      <div className="p-4 flex-1 flex flex-col space-y-4 overflow-hidden min-h-0">
        <div className={`flex flex-wrap items-center gap-2 bg-bg-surface p-2 border ${bulkSelectedIds.size > 0 ? 'border-border-hover' : 'border-border-main'} shrink-0 min-h-[42px]`}>
          <span className="text-[10px] font-mono text-text-dim flex-shrink-0 flex items-center justify-center w-6 h-6 bg-bg-input border border-border-main font-bold">{bulkSelectedIds.size}</span>
          <select 
            onChange={handleBulkMove}
            value=""
            disabled={bulkSelectedIds.size === 0}
            className="flex-1 min-w-[70px] bg-bg-input hover:bg-text-main hover:text-bg-base border border-border-main text-text-main text-[13px] font-mono px-2 py-1.5 outline-none transition-colors cursor-pointer disabled:opacity-50 disabled:hover:bg-bg-input disabled:hover:text-text-main"
          >
            <option value="" disabled className="bg-bg-panel text-text-dim">Move to...</option>
            <option value="copy_to_master" className="bg-bg-panel text-text-main">{t('copy_to_master_prompts', lang)}</option>
            <option value="copy_to_mixer" className="bg-bg-panel text-text-main">➡ {lang === 'en' ? 'Copy to Prompt Mixer' : 'プロンプトミキサーへコピー'}</option>
            <option disabled className="bg-bg-panel text-text-dim">──────────</option>
            {uniqueCategories.map(([cat, sec]) => (
              <option key={`${sec}:${cat}`} value={`${sec}:${cat}`} className="bg-bg-panel text-text-main">
                {t(cat as any, lang) || cat} ({getSectionDisplayName(sec, customSectionNames, lang)})
              </option>
            ))}
          </select>
          <button 
            onClick={handleBulkDelete}
            disabled={bulkSelectedIds.size === 0}
            className="flex items-center gap-1 px-2 py-1 bg-transparent hover:bg-red-500/10 border border-red-500/50 text-[10px] font-mono text-red-500 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" /> DELETE
          </button>
          <button 
            onClick={() => setBulkSelectedIds(new Set())} 
            disabled={bulkSelectedIds.size === 0}
            className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover text-[10px] font-mono text-text-dim transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {t('clear_selection', lang)}
          </button>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('search', lang)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-input border border-border-main text-[11px] font-mono px-8 py-2 focus:outline-none focus:border-border-hover text-text-main placeholder-gray-600"
              />
              <span className="absolute left-2.5 top-2.5 opacity-30 font-mono text-[10px] text-text-main">/</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            
            <button 
              onClick={() => setIsDuplicateModalOpen(true)}
              className="px-2.5 py-1 text-[10px] font-mono font-bold border border-border-main bg-bg-input hover:bg-bg-surface transition-colors text-text-main flex items-center justify-center gap-1.5 shrink-0"
            >
              <Search size={12} />
              {lang === 'en' ? 'Find Duplicates' : '重複サーチ'}
            </button>
            <div className="flex items-center border border-border-main bg-bg-input shadow-xs">
              <button 
                onClick={handleCollapsePrev}
                className="px-2 py-1 text-[10px] font-mono font-bold hover:bg-bg-surface text-text-main transition-colors flex items-center gap-1 border-r border-border-main"
                title={lang === 'en' ? 'Collapse 1 level' : '1段階閉じる'}
              >
                <ChevronsUp size={12} />
                {lang === 'en' ? 'Collapse' : '全て閉じる'}
              </button>
              <button 
                onClick={handleExpandNext}
                className="px-2.5 py-1 text-[10px] font-mono font-bold hover:bg-bg-surface text-text-main transition-colors flex items-center gap-1"
                title={lang === 'en' ? 'Expand 1 level' : '1段階開く'}
              >
                <ChevronsDown size={12} />
                {lang === 'en' ? 'Expand' : '全て開く'}
              </button>
              <div 
                className="px-2 py-1 text-[10px] font-mono font-bold border-l border-border-main bg-bg-panel text-text-dim flex items-center gap-0.5 select-none"
                title={
                  expandLevel === 0 
                    ? (lang === 'en' ? 'Stage 0: Main headers only (All collapsed)' : '段階 0: 大カテゴリのみ (全閉)')
                    : expandLevel === 1 
                      ? (lang === 'en' ? 'Stage 1: Categories open' : '段階 1: 中カテゴリ項目まで展開')
                      : (lang === 'en' ? 'Stage 2: All prompts open' : '段階 2: プロンプトまで全開')
                }
              >
                <span className="text-[9px] text-text-main font-bold">
                  {expandLevel === 0 ? 'Lv.0' : expandLevel === 1 ? 'Lv.1' : 'Lv.2'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        

        <div className="flex-1 overflow-y-scroll pr-2 space-y-4 content-start min-h-0 pb-12">
          {sectionOrder.map((secIdNum) => {
            const secId = String(secIdNum);
            const secData = groupedParts[secIdNum as keyof typeof groupedParts];
            if (!secData) return null;
            const catEntries = Object.entries(secData.categories) as [string, VariationPart[]][];

            const isSectionCollapsed = searchQuery.trim() ? false : !!collapsedSections[secIdNum];
            const borderBarColor = getSectionBorderBar(secId);
            const totalPartsInSection = catEntries.reduce((sum, [, items]) => sum + items.length, 0);

            return (
              <div 
                key={secId} 
                className="space-y-2"
                onDragOver={(e) => handleSectionDragOver(e, Number(secId))} onDrop={(e) => handleSectionContainerDrop(e, Number(secId))}
              >
                <div 
                  draggable={editingId === null && editingCategory === null && editingSectionId === null} 
                  onDragStart={(e) => handleSectionDragStart(e, Number(secId))} 
                  onDragEnd={handleSectionDragEnd} 
                  style={{ cursor: editingSectionId === null ? "pointer" : "default" }}
                  onClick={() => {
                    if (editingSectionId === null) {
                      toggleSectionCollapse(Number(secId));
                    }
                  }}
                  className={`flex items-center justify-between p-2 border border-border-main border-l-4 ${borderBarColor} bg-gray-500/15 hover:bg-gray-500/20 shadow-xs group text-text-main select-none transition-colors`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex flex-col shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => moveSection(Number(secId), 'up')} className="hover:text-text-main text-text-dim opacity-0 group-hover:opacity-100 transition-opacity"><ChevronUp size={12} /></button>
                      <button onClick={() => moveSection(Number(secId), 'down')} className="hover:text-text-main text-text-dim opacity-0 group-hover:opacity-100 transition-opacity"><ChevronDown size={12} /></button>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-text-main group-hover:text-text-main transition-colors">
                      {isSectionCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                    </div>

                    {editingSectionId === Number(secId) ? (
                      <div className="flex items-center flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editSectionName}
                          onChange={(e) => setEditSectionName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onRenameSection?.(Number(secId), editSectionName);
                              setEditingSectionId(null);
                            } else if (e.key === 'Escape') {
                              setEditingSectionId(null);
                            }
                          }}
                          className="text-xs font-mono font-bold uppercase bg-bg-input border border-border-main px-1 py-0.5 outline-none w-36 text-text-main"
                          autoFocus
                          onBlur={() => {
                            onRenameSection?.(Number(secId), editSectionName);
                            setEditingSectionId(null);
                          }}
                        />
                      </div>
                    ) : (
                      <h3 
                        className="text-xs font-mono font-bold uppercase flex items-center truncate tracking-wider text-text-main" 
                        title={lang === 'en' ? 'Click to expand/collapse' : 'クリックして開閉'}
                      >
                        <span className="truncate">{secData.name}</span>
                      </h3>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span 
                      className="text-[9px] font-mono px-1.5 py-0.5 border border-border-main bg-bg-panel text-text-main leading-none font-bold shadow-xs select-none"
                      title={`${catEntries.length} categories, ${totalPartsInSection} parts`}
                    >
                      {catEntries.length} CAT
                    </span>
                    {onAddCategory && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmAddCategoryData(Number(secId));
                        }}
                        className="px-1.5 py-0.5 bg-bg-input hover:bg-bg-surface border border-border-main flex items-center transition-all text-text-main hover:border-border-hover font-bold shadow-2xs"
                        title={lang === 'en' ? 'Add Category' : 'カテゴリーを追加'}
                      >
                        <Plus className="w-3 h-3" />
                        <span className="text-[9px] ml-1 font-mono font-bold">CAT</span>
                      </button>
                    )}
                    {onRenameSection && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSectionId(Number(secId));
                          setEditSectionName(secData.name);
                        }}
                        className="p-1 bg-bg-input hover:bg-bg-surface border border-border-main text-text-main hover:border-border-hover transition-colors shadow-2xs"
                        title={lang === 'en' ? 'Rename Section' : '名前を変更'}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {!isSectionCollapsed && catEntries.length > 0 && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="space-y-2 overflow-hidden"
                    >
                    {catEntries.map(([category, catParts]) => {
                      const totalCount = catParts.length;
                      return (

                        <div 
                          key={category}
                          draggable={editingId === null && editingCategory === null && editingSectionId === null}
                          onDragStart={(e) => handleCatDragStart(e, category, Number(secId))}
                          onDragEnd={handleCatDragEnd}
                          onDragOver={(e) => handleCatDragOver(e, Number(secId))}
                          onDrop={(e) => handleCatDrop(e, category, Number(secId))}
                        >
                        <Accordion 
                          key={category} 
                          title={t(category as any, lang) || category}
                          onEditStart={() => setEditingCategory(category)}
                          onEditEnd={() => setEditingCategory(null)} 
                          badge={totalCount} 
                          defaultOpen={false}
                          expandId={expandId}
                          collapseId={collapseId}
                          onEdit={onRenameCategory ? (newName) => onRenameCategory(Number(secId), category, newName) : undefined}
                          onDelete={onDeleteCategory ? () => setConfirmDeleteCategoryData({ section: Number(secId), name: category }) : undefined}
                          onAdd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmAddData({ category, section: Number(secId) });
                          }}
                        >
                          <div className="flex flex-col gap-2">
                            {catParts.length === 0 ? (
                              <div className="text-center py-4 text-text-dim text-[10px] font-mono italic">
                                {t('empty', lang) || 'Empty'}
                              </div>
                            ) : (
                              catParts.map((part, index) => {
                                const isSelected = selectedIds.has(part.id);
                            
                            if (editingId === part.id) {
                              return (
                                <div 
                                  key={part.id} 
                                  className="p-2 bg-bg-input border border-border-hover flex flex-col gap-2"
                                >
                                  <input 
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="bg-bg-base border border-border-main text-xs font-mono p-1.5 text-text-main focus:outline-none focus:border-border-hover w-full"
                                    placeholder={t('name', lang)}
                                  />
                                  <input 
                                    value={editCategory}
                                    onChange={e => setEditCategory(e.target.value)}
                                    className="bg-bg-base border border-border-main text-xs font-mono p-1.5 text-text-main focus:outline-none focus:border-border-hover w-full"
                                    placeholder={t('category', lang)}
                                  />
                                  <AutoResizeTextarea 
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    className="bg-bg-base border border-border-main text-[13px] leading-relaxed font-mono p-2 text-text-main focus:outline-none focus:border-border-hover resize-y w-full"
                                    minHeight={64}
                                    placeholder={t('content', lang)}
                                  />
                                  <div className="flex justify-between items-center mt-1">
                                    <button onClick={() => setConfirmDeleteId(part.id)} className="text-text-dim hover:text-text-main p-1">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(editContent);
                                          setCopiedPartId('edit_' + part.id);
                                          setTimeout(() => setCopiedPartId(null), 2000);
                                        }}
                                        className={`px-3 py-1.5 flex items-center justify-center gap-1.5 bg-transparent hover:bg-bg-input border text-[10px] font-mono transition-colors ${
                                          copiedPartId === 'edit_' + part.id ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-border-main text-text-dim hover:text-green-400'
                                        }`}
                                        title={lang === 'en' ? "Copy Prompt Text" : "プロンプトをコピー"}
                                      >
                                        {copiedPartId === 'edit_' + part.id ? (
                                          <Check className="w-3 h-3" />
                                        ) : (
                                          <div className="relative w-3 h-3 flex items-center justify-center">
                                            <div className="border border-current w-full h-full flex items-center justify-center font-mono text-[9px] font-bold leading-none">P</div>
                                          </div>
                                        )}
                                        COPY
                                      </button>
                                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-transparent hover:bg-bg-input border border-transparent hover:border-border-main text-text-dim hover:text-text-main text-[10px] font-mono transition-colors">
                                        CANCEL
                                      </button>
                                      <button onClick={() => handleSave(part.id)} className={`px-4 py-1.5 ${theme === 'mono' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 hover:bg-gray-500 text-white'} text-[10px] font-mono font-bold transition-colors`}>
                                        {t('save', lang)}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={part.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, part.id, category)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, category)}
                                onDrop={(e) => handleDrop(e, part.id, category)}
                                className={`p-2 flex items-center space-x-2 cursor-pointer transition-colors group relative ${isSelected ? (part.isNegative ? 'bg-red-500/10 border border-red-500/50' : 'bg-bg-surface border border-border-hover') : (part.isNegative ? 'bg-red-500/5 border border-red-500/30 hover:border-red-500/50' : 'bg-bg-input border border-border-main hover:border-border-hover')}`}
                                onClick={() => onTogglePart(part.id)}
                              >
                                <input 
                                  type="checkbox"
                                  checked={bulkSelectedIds.has(part.id)}
                                  onChange={() => {}}
                                  onClick={(e) => handleToggleBulkSelect(part.id, e)}
                                  className="w-3.5 h-3.5 flex-shrink-0 cursor-pointer accent-gray-600"
                                />
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <div className="flex justify-between items-center pr-6">
                                    <span className={`text-[13px] font-bold font-mono truncate text-text-main`}>
                                      {part.name}
                                    </span>
                                  </div>
                                  <span className="text-[12px] font-mono truncate mt-0.5 text-text-main opacity-80">{part.content || <span className="opacity-40">----- (No Content) -----</span>}</span>
                                </div>
                                <div className="absolute right-2 flex items-center gap-1">
                                  {expandedActionId !== part.id && (
                                    <>
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(part.content);
                                          setCopiedPartId(part.id);
                                          setTimeout(() => setCopiedPartId(null), 2000);
                                        }}
                                        className={`opacity-0 group-hover:opacity-100 p-1 bg-bg-panel border border-border-main transition-all ${
                                          copiedPartId === part.id 
                                            ? 'text-green-500 bg-green-500/10 opacity-100'
                                            : 'text-text-dim hover:text-green-400'
                                        }`}
                                        title={lang === 'en' ? 'Copy Prompt Text' : 'プロンプトをコピー'}
                                      >
                                        {copiedPartId === part.id ? (
                                          <Check className="w-3 h-3" />
                                        ) : (
                                          <div className="relative w-3 h-3 flex items-center justify-center">
                                            <div className="border border-current w-full h-full flex items-center justify-center font-mono text-[9px] font-bold leading-none">P</div>
                                          </div>
                                        )}
                                      </button>
                                      <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedActionId(part.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-text-main transition-opacity p-1 bg-bg-panel border border-border-main"
                                        title={lang === 'en' ? 'More actions' : 'メニュー'}
                                      >
                                        <MoreHorizontal className="w-3 h-3" />
                                      </button>
                                    </>
                                  )}
                                  
                                  {(expandedActionId === part.id || confirmQuickDeleteId === part.id) && (
                                    <>
                                      <div className="flex items-center bg-bg-panel border border-border-main overflow-hidden">
                                        <button 
                                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onReorder && index > 0) onReorder(part.id, catParts[0].id); }}
                                          className="p-1 text-text-dim hover:text-text-main hover:bg-bg-input transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                          disabled={index === 0}
                                          title="Move to Top"
                                        ><ChevronsUp className="w-3 h-3" /></button>
                                        <button 
                                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onReorder && index < catParts.length - 1) onReorder(part.id, catParts[catParts.length - 1].id); }}
                                          className="p-1 text-text-dim hover:text-text-main hover:bg-bg-input transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                          disabled={index === catParts.length - 1}
                                          title="Move to Bottom"
                                        ><ChevronsDown className="w-3 h-3" /></button>
                                      </div>
                                      <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onDuplicate) onDuplicate(part.id); }}
                                        className="text-text-dim hover:text-text-main p-1 bg-bg-panel border border-border-main"
                                        title="Duplicate"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onCopyToMaster) onCopyToMaster(part); }}
                                        className="text-text-dim hover:text-text-main p-1 bg-bg-panel border border-border-main"
                                        title="Copy to Master Prompts"
                                      >
                                        <ArrowLeftToLine className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onCopyToMixer) onCopyToMixer(part); }}
                                        className="text-text-dim hover:text-text-main p-1 bg-bg-panel border border-border-main"
                                        title="Copy to Prompt Mixer"
                                      >
                                        <ArrowLeftToLine className="w-3 h-3" style={{ transform: 'rotate(180deg)' }} />
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (confirmQuickDeleteId === part.id) {
                                            onDelete(part.id);
                                            setConfirmQuickDeleteId(null);
                                          } else {
                                            setConfirmQuickDeleteId(part.id);
                                            setTimeout(() => setConfirmQuickDeleteId(null), 3000);
                                          }
                                        }}
                                        className={`p-1 bg-bg-panel border border-border-main ${
                                          confirmQuickDeleteId === part.id 
                                            ? 'text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                                            : 'text-text-dim hover:text-red-400 hover:bg-bg-input'
                                        }`}
                                        title={confirmQuickDeleteId === part.id ? "Confirm delete" : "Delete"}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={(e) => startEdit(part, e)}
                                        className="text-text-dim hover:text-text-main p-1 bg-bg-panel border border-border-main"
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedActionId(null); }}
                                        className="text-text-dim hover:text-red-500 hover:bg-red-500/10 transition-colors p-1 bg-bg-panel border border-border-main"
                                        title="Close"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </>
                                  )}
                                  <div className="flex flex-col items-center justify-center -my-1 ml-1">
                                    {part.isNegative ? (
                                      <button 
                                        className="text-[8px] leading-none opacity-100 uppercase text-red-500 font-mono flex-shrink-0 py-1 px-1 font-bold hover:text-red-400"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onTogglePartNegative) onTogglePartNegative(part.id);
                                        }}
                                        title="Remove Negative Tag"
                                      >
                                        NEG
                                      </button>
                                    ) : (
                                      <button 
                                        className="text-[8px] leading-none opacity-0 group-hover:opacity-100 uppercase text-text-dim font-mono flex-shrink-0 py-1 px-1 hover:text-red-400 font-bold"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onTogglePartNegative) onTogglePartNegative(part.id);
                                        }}
                                        title="Mark as Negative Part"
                                      >
                                        NEG
                                      </button>
                                    )}
                                    {part.isPinned ? (
                                      <button 
                                        className="opacity-100 flex-shrink-0 p-1 hover:!text-text-main transition-colors"
                                        style={{ color: 'var(--mark-color)' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onTogglePin(part.id);
                                        }}
                                        title="Pinned Part"
                                      >
                                        <Pin className="w-3.5 h-3.5 fill-current" />
                                      </button>
                                    ) : (
                                      <button 
                                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 flex-shrink-0 p-1 hover:!text-text-main transition-opacity"
                                        style={{ color: 'var(--toolbar-icon-color)' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onTogglePin(part.id);
                                        }}
                                        title="Pin Part"
                                      >
                                        <Pin className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }))}
                        </div>
                      </Accordion>
                        </div>
                    );
                  })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {filteredParts.length === 0 && (
            <div className="text-center py-8 text-text-dim text-[10px] font-mono">
              {t('no_parts', lang)}
              </div>
          )}
        </div>
      </div>

      {onDeleteAll && (
        <div className="p-3 bg-bg-panel border-t border-border-main shrink-0">
          <button onClick={() => setConfirmDeleteAllState(true)} className="w-full py-2 bg-bg-input border border-dashed border-red-500/30 text-[11px] font-mono text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors">
            {t('delete_all', lang)}
          </button>
        </div>
      )}
      </>
      ) : activeTab === 'mixer' ? (
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <AttributeMixer 
            onApply={onMixAttributes || (() => {})} 
            onInsertText={onInsertText} 
            onCopyToParts={onCopyToParts} 
            theme={theme} 
            lang={lang} 
            existingParts={parts} 
            customSectionNames={customSectionNames} 
            customCategories={customCategories} 
          />
        </div>
      ) : (
        children
      )}

      <ConfirmModal
        isOpen={confirmBulkDelete}
        message={t('confirm_delete_bulk', lang)}
        onConfirm={confirmBulkDeleteExecute}
        onCancel={() => setConfirmBulkDelete(false)}
        lang={lang}
      />
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        message={t('confirm_delete', lang)}
        onConfirm={() => {
          if (confirmDeleteId) onDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
        lang={lang}
      />
      <AddModal
        isOpen={confirmAddData !== null}
        title={t('add_new_item', lang)}
        onConfirm={(name, content) => {
          if (confirmAddData) onAdd(confirmAddData.category, confirmAddData.section, name, content);
          setConfirmAddData(null);
        }}
        showContentField={true}
        onCancel={() => setConfirmAddData(null)}
        lang={lang}
      />
      <AddModal
        isOpen={confirmAddCategoryData !== null}
        title="New Category"
        onConfirm={(name) => {
          if (confirmAddCategoryData && onAddCategory) onAddCategory(confirmAddCategoryData, name);
          setConfirmAddCategoryData(null);
        }}
        onCancel={() => setConfirmAddCategoryData(null)}
        lang={lang}
      />
      <ConfirmModal
        isOpen={confirmDeleteCategoryData !== null}
        message={`Delete category "${confirmDeleteCategoryData?.name}" and all its parts?`}
        onConfirm={() => {
          if (confirmDeleteCategoryData && onDeleteCategory) onDeleteCategory(confirmDeleteCategoryData.section, confirmDeleteCategoryData.name);
          setConfirmDeleteCategoryData(null);
        }}
        onCancel={() => setConfirmDeleteCategoryData(null)}
        lang={lang}
      />
      <ConfirmModal
        isOpen={confirmDeleteAllState}
        message={t('confirm_delete_all', lang)}
        onConfirm={() => {
          if (onDeleteAll) onDeleteAll();
          setConfirmDeleteAllState(false);
        }}
        onCancel={() => setConfirmDeleteAllState(false)}
        lang={lang}
      />
<DuplicateSearchModal 
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        parts={parts}
        onDeleteBulk={(ids) => {
          if (onDeleteBulk) { onDeleteBulk(ids); } else { ids.forEach(id => onDelete(id)); }
        }}
        onMerge={(idsToMerge, mergedName, mergedContent, section, category) => {
          onAdd(category, section, mergedName, mergedContent);
          if (onDeleteBulk) { onDeleteBulk(idsToMerge); } else { idsToMerge.forEach(id => onDelete(id)); }
        }}
        lang={lang}
        theme={theme}
      />
    </>
  );
};
