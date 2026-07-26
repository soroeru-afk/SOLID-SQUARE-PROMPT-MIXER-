import React, { useMemo, useState } from 'react';
import { VariationPart } from '../types';
import { Accordion } from './Accordion';
import { ConfirmModal } from './ConfirmModal';
import { AddModal } from './AddModal';
import { Pencil, Trash2, Check, X, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Language, t } from '../i18n';

interface VariationColumnProps {
  parts: VariationPart[];
  selectedIds: Set<string>;
  onTogglePart: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAdd: (category: string, section: number, name: string) => void;
  onUpdate: (id: string, updates: Partial<VariationPart>) => void;
  onDelete: (id: string) => void;
  onReorder?: (draggedId: string, targetId: string) => void;
  lang: Language;
}

export const VariationColumn: React.FC<VariationColumnProps> = ({ 
  parts, selectedIds, onTogglePart, onTogglePin, onAdd, onUpdate, onDelete, onReorder, lang 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [draggedPart, setDraggedPart] = useState<{ id: string, category: string } | null>(null);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmAddData, setConfirmAddData] = useState<{ category: string, section: number } | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const uniqueCategories = useMemo(() => {
    const cats = new Map<string, number>(); // category -> section
    parts.forEach(p => cats.set(p.category, p.section));
    return Array.from(cats.entries());
  }, [parts]);

  const handleBulkMove = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
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

  const handleDragStart = (e: React.DragEvent, id: string, category: string) => {
    setDraggedPart({ id, category });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedPart(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, category: string) => {
    e.preventDefault();
    if (draggedPart?.category === category) {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDrop = (e: React.DragEvent, id: string, category: string) => {
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
  }, [filteredParts]);

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

      <div className="p-4 flex-1 flex flex-col space-y-4 overflow-hidden">
        <div className={`flex items-center gap-2 bg-bg-surface p-2 border ${bulkSelectedIds.size > 0 ? 'border-blue-500/30' : 'border-border-main'} rounded shadow-sm shrink-0 min-h-[42px]`}>
          <span className="text-[10px] font-mono text-text-dim flex-1">{bulkSelectedIds.size} selected</span>
          <select 
            onChange={handleBulkMove}
            value=""
            disabled={bulkSelectedIds.size === 0}
            className="bg-bg-input border border-border-main text-text-main text-[10px] font-mono px-2 py-1 rounded outline-none disabled:opacity-50"
          >
            <option value="" disabled>Move to...</option>
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

        <div className="flex-1 overflow-y-scroll pr-2 space-y-4 content-start">
          {(Object.entries(groupedParts) as [string, any][]).map(([secId, secData]) => {
            const catEntries = Object.entries(secData.categories) as [string, VariationPart[]][];
            if (catEntries.length === 0) return null;

            return (
              <div key={secId} className="space-y-4">
                <h3 className={`text-xs font-mono font-bold uppercase p-2 border-l-4 shadow-sm bg-transparent ${
                  secId === '1' ? 'border-blue-500 text-blue-400' : 
                  secId === '2' ? 'border-orange-500 text-orange-400' : 
                  secId === '3' ? 'border-green-500 text-green-400' : 
                  'border-purple-500 text-purple-400'
                }`}>
                  {secData.name}
                </h3>
                <div className="space-y-2">
                  {catEntries.map(([category, catParts]) => {
                    const totalCount = catParts.length;
                    return (
                      <Accordion 
                        key={category} 
                        title={t(category as any, lang)} 
                        badge={totalCount} 
                        defaultOpen={false}
                        expandId={expandId}
                        collapseId={collapseId}
                        onAdd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setConfirmAddData({ category, section: Number(secId) });
                        }}
                      >
                        <div className="flex flex-col gap-2">
                          {catParts.map((part, index) => {
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
                                    <span className={`text-[11px] font-mono truncate ${isSelected ? 'text-text-main' : 'text-text-dim'}`}>
                                      {part.name}
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-mono text-text-dim truncate mt-0.5">{part.content}</span>
                                </div>
                                <div className="absolute right-2 flex items-center gap-1">
                                  <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity bg-bg-panel rounded shadow-sm border border-border-main overflow-hidden">
                                    <button 
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onReorder && index > 0) onReorder(part.id, catParts[index - 1].id); }}
                                      className="p-1 text-text-dim hover:text-text-main hover:bg-bg-input transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                      disabled={index === 0}
                                    ><ChevronUp className="w-3 h-3" /></button>
                                    <button 
                                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onReorder && index < catParts.length - 1) onReorder(part.id, catParts[index + 1].id); }}
                                      className="p-1 text-text-dim hover:text-text-main hover:bg-bg-input transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                      disabled={index === catParts.length - 1}
                                    ><ChevronDown className="w-3 h-3" /></button>
                                  </div>
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
                          })}
                        </div>
                      </Accordion>
                    );
                  })}
                </div>
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
    </>
  );
};
