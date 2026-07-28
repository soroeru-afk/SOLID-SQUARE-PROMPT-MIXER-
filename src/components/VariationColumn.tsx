import React, { useMemo, useState } from 'react';
import { VariationPart } from '../types';
import { Accordion } from './Accordion';
import { ConfirmModal } from './ConfirmModal';
import { AddModal } from './AddModal';
import { Pencil, Trash2, Check, X, Plus, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, ArrowLeftToLine } from 'lucide-react';
import { Language, t } from '../i18n';

interface VariationColumnProps {
  parts: VariationPart[];
  customCategories?: { name: string, section: number }[];
  selectedIds: Set<string>;
  onTogglePart: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAdd: (category: string, section: number, name: string) => void;
  onUpdate: (id: string, updates: Partial<VariationPart>) => void;
  onDelete: (id: string) => void;
  onDeleteAll?: () => void;
  onAddCategory?: (section: number, name: string) => void;
  onRenameCategory?: (section: number, oldName: string, newName: string) => void;
  onDeleteCategory?: (section: number, name: string) => void;
  onReorderCategory?: (section: number, draggedCat: string, targetCat: string) => void;
  onReorder?: (draggedId: string, targetId: string) => void;
  onCopyToMaster?: (part: VariationPart) => void;
  onCopyBulkToMaster?: (items: VariationPart[]) => void;
  lang: Language;
}

export const VariationColumn: React.FC<VariationColumnProps> = ({ 
  parts, customCategories = [], selectedIds, onTogglePart, onTogglePin, onAdd, onUpdate, onDelete, onDeleteAll, onAddCategory, onRenameCategory, onDeleteCategory, onReorderCategory, onReorder, onCopyToMaster, onCopyBulkToMaster, lang 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [draggedPart, setDraggedPart] = useState<{ id: string, category: string } | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<{ name: string, section: number } | null>(null);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmAddData, setConfirmAddData] = useState<{ category: string, section: number } | null>(null);
  const [confirmAddCategoryData, setConfirmAddCategoryData] = useState<number | null>(null);
  const [confirmDeleteCategoryData, setConfirmDeleteCategoryData] = useState<{ section: number, name: string } | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [confirmDeleteAllState, setConfirmDeleteAllState] = useState(false);

  const uniqueCategories = useMemo(() => {
    const cats = new Map<string, number>(); // category -> section
    parts.forEach(p => cats.set(p.category, p.section));
    if (customCategories) {
      customCategories.forEach(c => cats.set(c.name, c.section));
    }
    return Array.from(cats.entries());
  }, [parts, customCategories]);

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

    const [sectionStr, ...catParts] = val.split(':');
    const category = catParts.join(':');
    const section = Number(sectionStr);
    
    bulkSelectedIds.forEach(id => {
      onUpdate(id, { category, section: section as 1|2|3|4 });
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


  const handleCatDragStart = (e: React.DragEvent, name: string, section: number) => {
    setDraggedCategory({ name, section });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };
  const handleCatDragEnd = (e: React.DragEvent) => {
    setDraggedCategory(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };
  const handleCatDragOver = (e: React.DragEvent, section: number) => {
    e.preventDefault();
    if (draggedCategory?.section === section) {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };
  const handleCatDrop = (e: React.DragEvent, targetName: string, section: number) => {
    e.preventDefault();
    if (!draggedCategory || draggedCategory.section !== section || draggedCategory.name === targetName) return;
    if (onReorderCategory) {
      onReorderCategory(section, draggedCategory.name, targetName);
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

  // Group by Section, then Category
  const groupedParts = useMemo(() => {
    const sections = {
      1: { name: t('sec_composition' as any, lang), categories: {} as Record<string, VariationPart[]> },
      2: { name: t('sec_pose' as any, lang), categories: {} as Record<string, VariationPart[]> },
      3: { name: t('sec_details' as any, lang), categories: {} as Record<string, VariationPart[]> },
      4: { name: t('sec_context' as any, lang), categories: {} as Record<string, VariationPart[]> },
    };

    customCategories.forEach(cat => {
      const sec = sections[cat.section as 1 | 2 | 3 | 4];
      if (sec && !sec.categories[cat.name]) {
        sec.categories[cat.name] = [];
      }
    });

    filteredParts.forEach((part) => {
      const sec = sections[part.section as 1 | 2 | 3 | 4] || sections[3]; // Fallback to 3 if somehow invalid
      if (!sec) return;
      if (!sec.categories[part.category]) {
        sec.categories[part.category] = [];
      }
      sec.categories[part.category].push(part);
    });

    // Sorting removed so users can fully freely reorder items including pinned ones
    return sections;
  }, [filteredParts, customCategories, lang]);

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
      <div className="flex bg-bg-panel border-b border-border-main text-[9px] font-mono uppercase tracking-widest shrink-0 overflow-x-auto justify-between items-center pr-2">
        <div className="px-4 py-3 border-r border-border-main bg-bg-surface text-text-main border-b-2 border-b-blue-500 whitespace-nowrap">{t('variation_parts', lang)}</div>
        <div className="flex gap-2">
          <button onClick={() => setExpandId(prev => prev + 1)} className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded transition-colors whitespace-nowrap">{t('expand_all', lang)}</button>
          <button onClick={() => setCollapseId(prev => prev + 1)} className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded transition-colors whitespace-nowrap">{t('collapse_all', lang)}</button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col space-y-4 overflow-hidden min-h-0">
        <div className={`flex flex-wrap items-center gap-2 bg-bg-surface p-2 border ${bulkSelectedIds.size > 0 ? 'border-blue-500/30' : 'border-border-main'} rounded shadow-sm shrink-0 min-h-[42px]`}>
          <span className="text-[10px] font-mono text-text-dim flex-shrink-0 flex items-center justify-center w-6 h-6 bg-bg-input rounded-full font-bold">{bulkSelectedIds.size}</span>
          <select 
            onChange={handleBulkMove}
            value=""
            disabled={bulkSelectedIds.size === 0}
            className="flex-1 min-w-[70px] bg-bg-input border border-border-main text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none disabled:opacity-50"
          >
            <option value="" disabled>Move to...</option>
            <option value="copy_to_master">{t('copy_to_master_prompts', lang)}</option>
            <option disabled>──────────</option>
            {uniqueCategories.map(([cat, sec]) => (
              <option key={`${sec}:${cat}`} value={`${sec}:${cat}`}>
                {t(cat as any, lang) || cat} ({t(`sec_${sec === 1 ? 'composition' : sec === 2 ? 'pose' : sec === 3 ? 'details' : 'context'}` as any, lang)})
              </option>
            ))}
          </select>
          <button 
            onClick={handleBulkDelete}
            disabled={bulkSelectedIds.size === 0}
            className="flex items-center gap-1 px-2 py-1 bg-transparent hover:bg-red-500/10 border border-red-500/50 rounded text-[10px] font-mono text-red-500 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" /> DELETE
          </button>
          <button 
            onClick={() => setBulkSelectedIds(new Set())} 
            disabled={bulkSelectedIds.size === 0}
            className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[10px] font-mono text-text-dim transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {t('clear_selection', lang)}
          </button>
        </div>

        <div className="flex space-x-2 shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('search', lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-input border border-border-main text-[11px] font-mono px-8 py-2 rounded focus:outline-none focus:border-blue-500 text-text-main placeholder-gray-600"
            />
            <span className="absolute left-2.5 top-2.5 opacity-30 font-mono text-[10px] text-text-main">/</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 content-start min-h-0 pb-12">
          {(Object.entries(groupedParts) as [string, any][]).map(([secId, secData]) => {
            const catEntries = Object.entries(secData.categories) as [string, VariationPart[]][];

            return (
              <div key={secId} className="space-y-4">
                <div className={`flex items-center justify-between p-2 border-l-4 shadow-sm bg-transparent group text-text-main ${
                  secId === '1' ? 'border-blue-500' : 
                  secId === '2' ? 'border-orange-500' : 
                  secId === '3' ? 'border-green-500' : 
                  'border-purple-500'
                }`}>
                  <h3 className="text-xs font-mono font-bold uppercase">
                    {secData.name}
                  </h3>
                  {onAddCategory && (
                    <button 
                      onClick={() => setConfirmAddCategoryData(Number(secId))}
                      className="px-1.5 py-0.5 bg-transparent border border-transparent hover:border-current rounded opacity-0 group-hover:opacity-100 flex items-center transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="text-[9px] ml-1 font-mono">CAT</span>
                    </button>
                  )}
                </div>
                {catEntries.length > 0 && (
                  <div className="space-y-2">
                    {catEntries.map(([category, catParts]) => {
                      const totalCount = catParts.length;
                      return (

                        <div 
                          key={category}
                          draggable
                          onDragStart={(e) => handleCatDragStart(e, category, Number(secId))}
                          onDragEnd={handleCatDragEnd}
                          onDragOver={(e) => handleCatDragOver(e, Number(secId))}
                          onDrop={(e) => handleCatDrop(e, category, Number(secId))}
                        >
                        <Accordion 
                          key={category} 
                          title={t(category as any, lang) || category} 
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
                                  className="p-2 rounded bg-bg-input border border-blue-500/50 flex flex-col gap-2"
                                >
                                  <input 
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="bg-bg-base border border-border-main text-xs font-mono p-1.5 rounded text-text-main focus:outline-none focus:border-blue-500 w-full"
                                    placeholder={t('name', lang)}
                                  />
                                  <input 
                                    value={editCategory}
                                    onChange={e => setEditCategory(e.target.value)}
                                    className="bg-bg-base border border-border-main text-xs font-mono p-1.5 rounded text-text-main focus:outline-none focus:border-blue-500 w-full"
                                    placeholder={t('category', lang)}
                                  />
                                  <textarea 
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    className="bg-bg-base border border-border-main text-[11px] font-mono p-1.5 rounded text-text-dim focus:outline-none focus:border-blue-500 resize-y min-h-[64px] h-16 w-full"
                                    placeholder={t('content', lang)}
                                  />
                                  <div className="flex justify-between items-center mt-1">
                                    <button onClick={() => setConfirmDeleteId(part.id)} className="text-text-dim hover:text-text-main p-1">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                    <div className="flex gap-2">
                                      <button onClick={() => setEditingId(null)} className="text-text-dim hover:text-text-dim p-1">
                                        <X className="w-3 h-3" />
                                      </button>
                                      <button onClick={() => handleSave(part.id)} className="text-green-500 hover:text-green-400 p-1">
                                        <Check className="w-3 h-3" />
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
                                className={`p-2 rounded flex items-center space-x-2 cursor-pointer transition-colors group relative ${
                                  isSelected ? 'bg-bg-surface border border-blue-500/30' : 'bg-bg-input border border-border-main hover:border-border-hover'
                                }`}
                                onClick={() => onTogglePart(part.id)}
                              >
                                <input 
                                  type="checkbox"
                                  checked={bulkSelectedIds.has(part.id)}
                                  onChange={() => {}}
                                  onClick={(e) => handleToggleBulkSelect(part.id, e)}
                                  className="w-3 h-3 flex-shrink-0 cursor-pointer accent-blue-500"
                                />
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <div className="flex justify-between items-center pr-6">
                                    <span className={`text-[13px] font-bold font-mono truncate ${isSelected ? 'text-text-main' : 'text-text-dim'}`}>
                                      {part.name}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-text-dim truncate mt-0.5">{part.content}</span>
                                </div>
                                <div className="absolute right-2 flex items-center gap-1">
                                  <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity bg-bg-panel rounded shadow-sm border border-border-main overflow-hidden">
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
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onCopyToMaster) onCopyToMaster(part); }}
                                    className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-green-400 transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main"
                                    title="Copy to Master Prompts"
                                  >
                                    <ArrowLeftToLine className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={(e) => startEdit(part, e)}
                                    className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-blue-400 transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  {part.isPinned ? (
                                    <button 
                                      className="text-[9px] opacity-100 uppercase text-blue-400 font-mono flex-shrink-0 p-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePin(part.id);
                                      }}
                                    >
                                      ⭐
                                    </button>
                                  ) : (
                                    <button 
                                      className="text-[9px] opacity-0 group-hover:opacity-100 uppercase text-text-dim font-mono flex-shrink-0 p-1 hover:text-blue-400"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePin(part.id);
                                      }}
                                    >
                                      PIN
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          }))}
                        </div>
                      </Accordion>
                        </div>
                    );
                  })}
                  </div>
                )}
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
          <button onClick={() => setConfirmDeleteAllState(true)} className="w-full py-2 bg-bg-input border border-dashed border-red-500/30 rounded text-[11px] font-mono text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors">
            {t('delete_all', lang)}
          </button>
        </div>
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
        onConfirm={(name) => {
          if (confirmAddData) onAdd(confirmAddData.category, confirmAddData.section, name);
          setConfirmAddData(null);
        }}
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
    </>
  );
};
