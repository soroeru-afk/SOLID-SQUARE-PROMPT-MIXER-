import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { VariationPart } from '../types';
import { Language, t } from '../i18n';
import { getSectionDisplayName } from '../utils/categoryUtils';
import { X, Search, CheckSquare, Square, PlusCircle, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export type PartComparisonStatus = 'new' | 'conflict' | 'identical';
export type PartConflictResolution = 'overwrite' | 'add_new';

export interface PartComparisonItem {
  id: string;
  incoming: VariationPart;
  existing?: VariationPart;
  status: PartComparisonStatus;
  selected: boolean;
  resolution: PartConflictResolution;
}

interface PartComparisonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingParts: VariationPart[];
  incomingParts: VariationPart[];
  incomingCustomCategories?: { name: string; section: 1 | 2 | 3 | 4 | 5 }[];
  customSectionNames?: Record<number, string>;
  onApply: (params: {
    toAdd: VariationPart[];
    toUpdate: { id: string; updates: Partial<VariationPart> }[];
    newCategories: { name: string; section: 1 | 2 | 3 | 4 | 5 }[];
  }) => void;
  lang: Language;
}

export const PartComparisonImportModal: React.FC<PartComparisonImportModalProps> = ({
  isOpen,
  onClose,
  existingParts,
  incomingParts,
  incomingCustomCategories = [],
  customSectionNames,
  onApply,
  lang,
}) => {
  const [items, setItems] = useState<PartComparisonItem[]>([]);
  const [filterSection, setFilterSection] = useState<number | 'all'>('all');
  const [filterTab, setFilterTab] = useState<'all' | 'conflict' | 'new' | 'identical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultConflictResolution, setDefaultConflictResolution] = useState<PartConflictResolution>('overwrite');

  // Build comparison items when opened or incoming/existing parts change
  useEffect(() => {
    if (!isOpen) return;

    // Existing indexing maps
    const mapById = new Map<string, VariationPart>();
    const mapByComposite = new Map<string, VariationPart>(); // section:::category:::name
    const mapByNameAndSec = new Map<string, VariationPart>(); // section:::name

    existingParts.forEach(p => {
      mapById.set(p.id, p);
      const catKey = `${p.section}:::${p.category.trim().toLowerCase()}:::${p.name.trim().toLowerCase()}`;
      mapByComposite.set(catKey, p);
      const secNameKey = `${p.section}:::${p.name.trim().toLowerCase()}`;
      mapByNameAndSec.set(secNameKey, p);
    });

    const comparisonList: PartComparisonItem[] = incomingParts.map((inc, index) => {
      // Find match: ID > Section+Category+Name > Section+Name
      const catKey = `${inc.section}:::${inc.category.trim().toLowerCase()}:::${inc.name.trim().toLowerCase()}`;
      const secNameKey = `${inc.section}:::${inc.name.trim().toLowerCase()}`;
      const match = mapById.get(inc.id) || mapByComposite.get(catKey) || mapByNameAndSec.get(secNameKey);

      let status: PartComparisonStatus = 'new';
      if (match) {
        const contentSame = (inc.content || '').trim() === (match.content || '').trim();
        const negSame = Boolean(inc.isNegative) === Boolean(match.isNegative);
        const nameSame = inc.name.trim() === match.name.trim();
        const catSame = inc.category.trim().toLowerCase() === match.category.trim().toLowerCase();

        if (contentSame && negSame && nameSame && catSame) {
          status = 'identical';
        } else {
          status = 'conflict';
        }
      }

      // Default selection: select 'new' and 'conflict' items; deselect 'identical' items
      const selected = status !== 'identical';

      return {
        id: inc.id || `inc_part_${index}_${Date.now()}`,
        incoming: inc,
        existing: match,
        status,
        selected,
        resolution: 'overwrite',
      };
    });

    setItems(comparisonList);
    setSearchQuery('');
    setFilterTab('all');
    setFilterSection('all');
  }, [isOpen, incomingParts, existingParts]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = items.length;
    const newCount = items.filter(i => i.status === 'new').length;
    const conflictCount = items.filter(i => i.status === 'conflict').length;
    const identicalCount = items.filter(i => i.status === 'identical').length;
    const selectedCount = items.filter(i => i.selected).length;

    // Per-section counts
    const sectionCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    items.forEach(i => {
      const sec = [1, 2, 3, 4].includes(i.incoming.section) ? i.incoming.section : 5;
      sectionCounts[sec] = (sectionCounts[sec] || 0) + 1;
    });

    return { total, newCount, conflictCount, identicalCount, selectedCount, sectionCounts };
  }, [items]);

  // Filtered items based on Section, Status, and Search query
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Section filter
      if (filterSection !== 'all') {
        const effectiveSec = [1, 2, 3, 4].includes(item.incoming.section) ? item.incoming.section : 5;
        if (effectiveSec !== filterSection) return false;
      }

      // Status filter
      if (filterTab !== 'all' && item.status !== filterTab) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.incoming.name.toLowerCase().includes(query);
        const matchCategory = item.incoming.category.toLowerCase().includes(query);
        const matchContent = item.incoming.content.toLowerCase().includes(query);
        const secName = getSectionDisplayName(item.incoming.section, customSectionNames, lang).toLowerCase();
        const matchSec = secName.includes(query);

        const matchExisting = item.existing && (
          item.existing.name.toLowerCase().includes(query) ||
          item.existing.category.toLowerCase().includes(query) ||
          item.existing.content.toLowerCase().includes(query)
        );

        return matchName || matchCategory || matchContent || matchSec || !!matchExisting;
      }

      return true;
    });
  }, [items, filterSection, filterTab, searchQuery, customSectionNames, lang]);

  // Bulk toggles
  const handleSelectAll = (select: boolean) => {
    // If a section is selected, toggle items in current section filter, otherwise toggle all
    setItems(prev => prev.map(item => {
      if (filterSection !== 'all') {
        const effectiveSec = [1, 2, 3, 4].includes(item.incoming.section) ? item.incoming.section : 5;
        if (effectiveSec !== filterSection) return item;
      }
      return { ...item, selected: select };
    }));
  };

  const handleSelectByStatus = (status: PartComparisonStatus) => {
    setItems(prev => prev.map(item => {
      if (filterSection !== 'all') {
        const effectiveSec = [1, 2, 3, 4].includes(item.incoming.section) ? item.incoming.section : 5;
        if (effectiveSec !== filterSection) return item;
      }
      return item.status === status ? { ...item, selected: true } : item;
    }));
  };

  const handleToggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  const handleSetResolution = (id: string, resolution: PartConflictResolution) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, resolution } : i));
  };

  const handleSetAllConflictResolution = (resolution: PartConflictResolution) => {
    setDefaultConflictResolution(resolution);
    setItems(prev => prev.map(i => i.status === 'conflict' ? { ...i, resolution } : i));
  };

  // Execute import
  const handleExecuteImport = () => {
    const selectedItems = items.filter(i => i.selected);
    if (selectedItems.length === 0) return;

    const toAdd: VariationPart[] = [];
    const toUpdate: { id: string; updates: Partial<VariationPart> }[] = [];
    const newCategories: { name: string; section: 1 | 2 | 3 | 4 | 5 }[] = [...incomingCustomCategories];

    selectedItems.forEach((item, idx) => {
      if (item.status === 'new') {
        toAdd.push({
          id: item.incoming.id || `p_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 6)}`,
          section: item.incoming.section,
          category: item.incoming.category,
          name: item.incoming.name,
          content: item.incoming.content,
          isPinned: item.incoming.isPinned,
          isNegative: item.incoming.isNegative,
        });

        // Ensure category is in newCategories list if not present
        if (!newCategories.some(c => c.section === item.incoming.section && c.name.toLowerCase() === item.incoming.category.toLowerCase())) {
          newCategories.push({ name: item.incoming.category, section: item.incoming.section });
        }
      } else if (item.status === 'conflict') {
        if (item.resolution === 'overwrite' && item.existing) {
          toUpdate.push({
            id: item.existing.id,
            updates: {
              name: item.incoming.name,
              category: item.incoming.category,
              section: item.incoming.section,
              content: item.incoming.content,
              isNegative: item.incoming.isNegative,
              isPinned: item.incoming.isPinned,
            },
          });
        } else {
          // Keep both / add as new with distinct name
          const newName = item.existing && item.existing.name === item.incoming.name
            ? `${item.incoming.name} (Imported)`
            : item.incoming.name;

          toAdd.push({
            id: `p_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 6)}`,
            section: item.incoming.section,
            category: item.incoming.category,
            name: newName,
            content: item.incoming.content,
            isPinned: item.incoming.isPinned,
            isNegative: item.incoming.isNegative,
          });

          if (!newCategories.some(c => c.section === item.incoming.section && c.name.toLowerCase() === item.incoming.category.toLowerCase())) {
            newCategories.push({ name: item.incoming.category, section: item.incoming.section });
          }
        }
      } else if (item.status === 'identical') {
        // If identical was explicitly selected, add as duplicate copy
        toAdd.push({
          id: `p_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 6)}`,
          section: item.incoming.section,
          category: item.incoming.category,
          name: `${item.incoming.name} (Copy)`,
          content: item.incoming.content,
          isPinned: item.incoming.isPinned,
          isNegative: item.incoming.isNegative,
        });
      }
    });

    onApply({ toAdd, toUpdate, newCategories });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="bg-bg-panel border border-border-main shadow-2xl flex flex-col w-full max-w-6xl h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-3.5 bg-bg-panel border-b border-border-main flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest text-accent-main uppercase px-2 py-0.5 border border-border-main bg-bg-input">
                PARTS IMPORT COMPARISON
              </span>
              <h2 className="text-sm font-mono font-bold text-text-main flex items-center gap-2">
                <Layers className="w-4 h-4 text-text-dim" />
                <span>{lang === 'en' ? 'Variation Parts Comparison & Import' : 'パーツ比較インポート'}</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-text-dim hover:text-text-main border border-transparent hover:border-border-main transition-colors"
              title={t('cancel', lang)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader: Stats and Count Overview */}
          <div className="px-4 py-2.5 bg-bg-surface/80 border-b border-border-main flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-[#332B24] font-bold">
                {lang === 'en' ? 'PARTS IN FILE:' : '取り込み対象:'}{' '}
                <strong className="text-black font-black">{stats.total}</strong>
              </span>
              <span className="text-[#A09585]">|</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-1">
                <PlusCircle className="w-3 h-3" />
                {lang === 'en' ? 'NEW:' : '新規:'} {stats.newCount}
              </span>
              <span className="text-[#A09585]">|</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {lang === 'en' ? 'DIFF/CONFLICT:' : '変更・競合:'} {stats.conflictCount}
              </span>
              <span className="text-[#A09585]">|</span>
              <span className="text-[#4A4035] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {lang === 'en' ? 'IDENTICAL:' : '同一一致:'} {stats.identicalCount}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-[#332B24] font-bold">{lang === 'en' ? 'SELECTED:' : 'インポート選択中:'}</span>
              <span className="px-2 py-0.5 bg-[#73634F] text-white font-bold">
                {stats.selectedCount} / {stats.total}
              </span>
            </div>
          </div>

          {/* Section Filter Bar (Crucial for managing numerous parts smoothly) */}
          <div className="px-3 py-2 bg-bg-panel border-b border-border-main flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-[#4A4035] font-bold uppercase tracking-wider mr-1">
              SECTION:
            </span>
            <button
              onClick={() => setFilterSection('all')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition-colors ${
                filterSection === 'all'
                  ? 'bg-[#73634F] text-white border-[#73634F]'
                  : 'bg-white text-[#332B24] border-border-main hover:bg-bg-surface'
              }`}
            >
              {lang === 'en' ? 'ALL SECTIONS' : '全セクション'} ({stats.total})
            </button>
            {[1, 2, 3, 4, 5].map(sec => {
              const secName = getSectionDisplayName(sec, customSectionNames, lang);
              const count = stats.sectionCounts[sec] || 0;
              return (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition-colors ${
                    filterSection === sec
                      ? 'bg-[#73634F] text-white border-[#73634F]'
                      : 'bg-white text-[#332B24] border-border-main hover:bg-bg-surface'
                  }`}
                >
                  SEC {sec}: {secName} ({count})
                </button>
              );
            })}
          </div>

          {/* Secondary Controls Bar: Status Filter & Bulk Selection & Conflict Handling & Search */}
          <div className="p-3 bg-bg-panel border-b border-border-main flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            {/* Status Filter Tabs */}
            <div className="flex items-center border border-border-main bg-white text-[10px] font-mono">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 font-bold transition-colors ${
                  filterTab === 'all' ? 'bg-[#73634F] text-white' : 'text-[#4A4035] hover:text-black hover:bg-bg-surface'
                }`}
              >
                {lang === 'en' ? 'ALL' : 'すべて'} ({stats.total})
              </button>
              <button
                onClick={() => setFilterTab('conflict')}
                className={`px-3 py-1 border-l border-border-main font-bold transition-colors ${
                  filterTab === 'conflict' ? 'bg-amber-800 text-white border-amber-800' : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                {lang === 'en' ? 'DIFF' : '変更・競合'} ({stats.conflictCount})
              </button>
              <button
                onClick={() => setFilterTab('new')}
                className={`px-3 py-1 border-l border-border-main font-bold transition-colors ${
                  filterTab === 'new' ? 'bg-emerald-800 text-white border-emerald-800' : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {lang === 'en' ? 'NEW' : '新規'} ({stats.newCount})
              </button>
              <button
                onClick={() => setFilterTab('identical')}
                className={`px-3 py-1 border-l border-border-main font-bold transition-colors ${
                  filterTab === 'identical' ? 'bg-[#73634F] text-white' : 'text-[#4A4035] hover:text-black hover:bg-bg-surface'
                }`}
              >
                {lang === 'en' ? 'SAME' : '同一'} ({stats.identicalCount})
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <button
                onClick={() => handleSelectAll(true)}
                className="px-2 py-1 bg-white border border-border-main text-[#332B24] font-bold hover:bg-bg-surface transition-colors"
              >
                {lang === 'en' ? 'Select All' : '全選択'}
              </button>
              <button
                onClick={() => handleSelectAll(false)}
                className="px-2 py-1 bg-white border border-border-main text-[#332B24] font-bold hover:bg-bg-surface transition-colors"
              >
                {lang === 'en' ? 'Deselect All' : '全解除'}
              </button>
              <button
                onClick={() => handleSelectByStatus('new')}
                className="px-2 py-1 bg-white border border-emerald-700 text-emerald-800 font-bold hover:bg-emerald-50 transition-colors"
              >
                {lang === 'en' ? 'Select New' : '新規のみ選択'}
              </button>
              <button
                onClick={() => handleSelectByStatus('conflict')}
                className="px-2 py-1 bg-white border border-amber-800 text-amber-900 font-bold hover:bg-amber-50 transition-colors"
              >
                {lang === 'en' ? 'Select Diff' : '変更のみ選択'}
              </button>
            </div>

            {/* Batch Conflict Resolution */}
            {stats.conflictCount > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className="text-[#4A4035] font-bold">{lang === 'en' ? 'Diff action:' : '競合時の一括動作:'}</span>
                <div className="flex border border-border-main bg-white">
                  <button
                    onClick={() => handleSetAllConflictResolution('overwrite')}
                    className={`px-2 py-1 transition-colors ${
                      defaultConflictResolution === 'overwrite' ? 'bg-[#73634F] text-white font-bold' : 'text-[#4A4035] hover:text-black'
                    }`}
                  >
                    {lang === 'en' ? 'Overwrite' : '上書き'}
                  </button>
                  <button
                    onClick={() => handleSetAllConflictResolution('add_new')}
                    className={`px-2 py-1 border-l border-border-main transition-colors ${
                      defaultConflictResolution === 'add_new' ? 'bg-[#73634F] text-white font-bold' : 'text-[#4A4035] hover:text-black'
                    }`}
                  >
                    {lang === 'en' ? 'Keep Both' : '別名追加'}
                  </button>
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="relative w-56 ml-auto">
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-[#7D7265] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search parts or category...' : 'パーツ名・カテゴリ・内容を検索...'}
                className="w-full bg-white border border-border-main text-[10px] font-mono pl-7 pr-2 py-1 text-[#201D1A] placeholder:text-[#7D7265] focus:outline-none focus:border-border-hover"
              />
            </div>
          </div>

          {/* Parts Comparison List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-bg-base">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 text-text-dim font-mono text-xs">
                {lang === 'en' ? 'No parts match the current filter.' : '該当するパーツはありません。'}
              </div>
            ) : (
              filteredItems.map(item => {
                const isConflict = item.status === 'conflict';
                const isNew = item.status === 'new';
                const isIdentical = item.status === 'identical';
                const secName = getSectionDisplayName(item.incoming.section, customSectionNames, lang);

                return (
                  <div
                    key={item.id}
                    className={`border transition-colors ${
                      item.selected
                        ? isConflict
                          ? 'border-amber-600 bg-white shadow-xs'
                          : isNew
                          ? 'border-emerald-600 bg-white shadow-xs'
                          : 'border-[#73634F] bg-white shadow-xs'
                        : 'border-border-main bg-white'
                    }`}
                  >
                    {/* Part Row Header */}
                    <div className="p-2.5 bg-bg-surface/60 border-b border-border-main flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
                        <button
                          type="button"
                          onClick={() => handleToggleItem(item.id)}
                          className="text-[#201D1A] hover:text-[#D95430] transition-colors shrink-0"
                        >
                          {item.selected ? (
                            <CheckSquare className="w-4 h-4 text-[#D95430]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#7D7265]" />
                          )}
                        </button>

                        {/* Status Badge */}
                        {isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-400 shrink-0">
                            NEW (新規)
                          </span>
                        )}
                        {isConflict && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider bg-amber-100 text-amber-900 border border-amber-400 shrink-0">
                            DIFF (変更・競合)
                          </span>
                        )}
                        {isIdentical && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider bg-white text-[#332B24] border border-border-main shrink-0">
                            SAME (同一一致)
                          </span>
                        )}

                        {/* Section & Category Badge */}
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-border-main text-[#332B24] shrink-0">
                          SEC {item.incoming.section}: {secName} &gt; <strong className="text-black font-bold">{item.incoming.category}</strong>
                        </span>

                        {/* Part Name */}
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1A1816] truncate">
                          <span className="truncate">{item.incoming.name}</span>
                          {item.incoming.isNegative && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-900 border border-red-300 font-bold shrink-0">
                              NEGATIVE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Conflict Resolution Selector */}
                      {isConflict && (
                        <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
                          <span className="text-[#4A4035] font-bold">{lang === 'en' ? 'Action:' : '取り込み方法:'}</span>
                          <div className="flex border border-border-main bg-white">
                            <button
                              type="button"
                              onClick={() => handleSetResolution(item.id, 'overwrite')}
                              className={`px-2 py-0.5 font-bold transition-colors ${
                                item.resolution === 'overwrite'
                                  ? 'bg-amber-800 text-white border-r border-border-main'
                                  : 'text-[#4A4035] hover:text-black border-r border-border-main'
                              }`}
                            >
                              {lang === 'en' ? 'Overwrite' : '上書き'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetResolution(item.id, 'add_new')}
                              className={`px-2 py-0.5 font-bold transition-colors ${
                                item.resolution === 'add_new'
                                  ? 'bg-[#73634F] text-white'
                                  : 'text-[#4A4035] hover:text-black'
                              }`}
                            >
                              {lang === 'en' ? 'Keep Both' : '別名追加'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Part Content Comparison */}
                    <div className="p-3 text-[11px] font-mono">
                      {isConflict && item.existing ? (
                        /* Side-by-side comparison */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Current Part in App */}
                          <div className="border border-border-main bg-white p-2.5 flex flex-col gap-1.5 shadow-xs">
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#201D1A] border-b border-border-main pb-1">
                              <span>【{lang === 'en' ? 'CURRENT IN APP' : '現在アプリ内にあるパーツ'}】</span>
                              <span className="text-[#554C41]">
                                SEC {item.existing.section} &gt; {item.existing.category} &gt; {item.existing.name}
                              </span>
                            </div>
                            <div className="text-[#1A1816] font-medium whitespace-pre-wrap break-all max-h-32 overflow-y-auto leading-relaxed bg-white p-2 border border-border-main">
                              {item.existing.content || <span className="text-gray-500 italic">(空)</span>}
                            </div>
                            {item.existing.isNegative && (
                              <span className="text-[10px] text-red-900 dark:text-red-400 font-bold">※ ネガティブ指定</span>
                            )}
                          </div>

                          {/* Incoming Part from File */}
                          <div className="border border-amber-600/50 bg-white p-2.5 flex flex-col gap-1.5 shadow-xs">
                            <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 border-b border-amber-300 pb-1">
                              <span>【{lang === 'en' ? 'FILE TO IMPORT' : 'ファイル内の取り込みパーツ'}】</span>
                              <span className="text-amber-900 font-bold">
                                SEC {item.incoming.section} &gt; {item.incoming.category} &gt; {item.incoming.name}
                              </span>
                            </div>
                            <div className="text-[#1A1816] font-medium whitespace-pre-wrap break-all max-h-32 overflow-y-auto leading-relaxed bg-white p-2 border border-amber-300">
                              {item.incoming.content || <span className="text-gray-500 italic">(空)</span>}
                            </div>
                            {item.incoming.isNegative && (
                              <span className="text-[10px] text-red-900 dark:text-red-400 font-bold">※ ネガティブ指定</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Single view for New or Identical */
                        <div className="border border-border-main bg-white p-2.5 flex flex-col gap-1.5 shadow-xs">
                          <div className="flex items-center justify-between text-[10px] font-bold text-[#201D1A] border-b border-border-main pb-1">
                            <span>
                              {isNew
                                ? (lang === 'en' ? 'NEW PART TO ADD' : '新規追加されるパーツ')
                                : (lang === 'en' ? 'IDENTICAL CONTENT (Already exists in app)' : '同一内容（既にアプリ内に登録済み）')}
                            </span>
                            <span className="text-[#554C41] font-bold">
                              SEC {item.incoming.section} &gt; {item.incoming.category} &gt; {item.incoming.name}
                            </span>
                          </div>
                          <div className="text-[#1A1816] font-medium whitespace-pre-wrap break-all max-h-28 overflow-y-auto leading-relaxed bg-white p-2 border border-border-main">
                            {item.incoming.content || <span className="text-gray-500 italic">(空)</span>}
                          </div>
                          {item.incoming.isNegative && (
                            <span className="text-[10px] text-red-900 dark:text-red-400 font-bold">※ ネガティブ指定</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-3.5 bg-bg-panel border-t border-border-main flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs font-mono text-text-dim flex items-center gap-2">
              <span>{lang === 'en' ? 'READY TO IMPORT:' : '取り込み予定:'}</span>
              <strong className="text-text-main">{stats.selectedCount} {lang === 'en' ? 'parts' : '件'}</strong>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-bg-input hover:bg-border-main text-text-dim hover:text-text-main text-xs font-mono border border-border-main transition-colors"
              >
                {t('cancel', lang)}
              </button>
              <button
                type="button"
                disabled={stats.selectedCount === 0}
                onClick={handleExecuteImport}
                className="px-5 py-2 bg-text-main text-bg-base hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono font-bold transition-all flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                {lang === 'en'
                  ? `Import Selected Parts (${stats.selectedCount})`
                  : `選択した ${stats.selectedCount} 件のパーツをインポート`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
