import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MasterPrompt } from '../types';
import { Language, t } from '../i18n';
import { X, Search, CheckSquare, Square, ArrowRight, RefreshCw, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { renderMarkSymbol } from './MasterColumn';

export type ComparisonStatus = 'new' | 'conflict' | 'identical';
export type ConflictResolution = 'overwrite' | 'add_new';

export interface ComparisonItem {
  id: string;
  incoming: MasterPrompt;
  existing?: MasterPrompt;
  status: ComparisonStatus;
  selected: boolean;
  resolution: ConflictResolution;
}

interface PromptComparisonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'master' | 'negative' | 'memo';
  existingItems: MasterPrompt[];
  incomingRawItems: MasterPrompt[];
  onApply: (params: {
    toAdd: MasterPrompt[];
    toUpdate: { id: string; updates: Partial<MasterPrompt> }[];
  }) => void;
  lang: Language;
}

export const PromptComparisonImportModal: React.FC<PromptComparisonImportModalProps> = ({
  isOpen,
  onClose,
  type,
  existingItems,
  incomingRawItems,
  onApply,
  lang,
}) => {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'conflict' | 'new' | 'identical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultConflictResolution, setDefaultConflictResolution] = useState<ConflictResolution>('overwrite');

  // Build comparison items when opened or when incoming items change
  useEffect(() => {
    if (!isOpen) return;

    const existingMapById = new Map<string, MasterPrompt>();
    const existingMapByName = new Map<string, MasterPrompt>();

    existingItems.forEach(item => {
      existingMapById.set(item.id, item);
      existingMapByName.set(item.name.trim().toLowerCase(), item);
    });

    const comparisonList: ComparisonItem[] = incomingRawItems.map((inc, index) => {
      // Find matching existing item by ID first, then by normalized Name
      const match = existingMapById.get(inc.id) || existingMapByName.get(inc.name.trim().toLowerCase());

      let status: ComparisonStatus = 'new';
      if (match) {
        const contentSame = (inc.content || '').trim() === (match.content || '').trim();
        const negSame = (inc.negativeContent || '').trim() === (match.negativeContent || '').trim();
        const markSame = (inc.mark || '') === (match.mark || '');
        const nameSame = inc.name.trim() === match.name.trim();

        if (contentSame && negSame && markSame && nameSame) {
          status = 'identical';
        } else {
          status = 'conflict';
        }
      }

      // Default selection: select 'new' and 'conflict' items; deselect 'identical' items
      const selected = status !== 'identical';

      return {
        id: inc.id || `inc_${index}_${Date.now()}`,
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
  }, [isOpen, incomingRawItems, existingItems]);

  // Statistics counts
  const stats = useMemo(() => {
    const total = items.length;
    const newCount = items.filter(i => i.status === 'new').length;
    const conflictCount = items.filter(i => i.status === 'conflict').length;
    const identicalCount = items.filter(i => i.status === 'identical').length;
    const selectedCount = items.filter(i => i.selected).length;
    return { total, newCount, conflictCount, identicalCount, selectedCount };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filterTab !== 'all' && item.status !== filterTab) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.incoming.name.toLowerCase().includes(query);
        const matchContent = item.incoming.content.toLowerCase().includes(query);
        const matchNeg = (item.incoming.negativeContent || '').toLowerCase().includes(query);
        const matchExisting = item.existing && (
          item.existing.name.toLowerCase().includes(query) ||
          item.existing.content.toLowerCase().includes(query) ||
          (item.existing.negativeContent || '').toLowerCase().includes(query)
        );
        return matchName || matchContent || matchNeg || !!matchExisting;
      }
      return true;
    });
  }, [items, filterTab, searchQuery]);

  // Bulk toggles
  const handleSelectAll = (select: boolean) => {
    setItems(prev => prev.map(i => ({ ...i, selected: select })));
  };

  const handleSelectByStatus = (status: ComparisonStatus) => {
    setItems(prev => prev.map(i => i.status === status ? { ...i, selected: true } : i));
  };

  const handleToggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  const handleSetResolution = (id: string, resolution: ConflictResolution) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, resolution } : i));
  };

  const handleSetAllConflictResolution = (resolution: ConflictResolution) => {
    setDefaultConflictResolution(resolution);
    setItems(prev => prev.map(i => i.status === 'conflict' ? { ...i, resolution } : i));
  };

  // Execution
  const handleExecuteImport = () => {
    const selectedItems = items.filter(i => i.selected);
    if (selectedItems.length === 0) return;

    const toAdd: MasterPrompt[] = [];
    const toUpdate: { id: string; updates: Partial<MasterPrompt> }[] = [];

    selectedItems.forEach((item, idx) => {
      if (item.status === 'new') {
        toAdd.push({
          id: item.incoming.id || `prompt_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 6)}`,
          name: item.incoming.name,
          content: item.incoming.content,
          negativeContent: item.incoming.negativeContent,
          mark: item.incoming.mark,
        });
      } else if (item.status === 'conflict') {
        if (item.resolution === 'overwrite' && item.existing) {
          toUpdate.push({
            id: item.existing.id,
            updates: {
              name: item.incoming.name,
              content: item.incoming.content,
              negativeContent: item.incoming.negativeContent,
              mark: item.incoming.mark,
            },
          });
        } else {
          // Add as new / keep both with differentiated title if conflict
          const newName = item.existing && item.existing.name === item.incoming.name
            ? `${item.incoming.name} (Imported)`
            : item.incoming.name;
          toAdd.push({
            id: `prompt_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 6)}`,
            name: newName,
            content: item.incoming.content,
            negativeContent: item.incoming.negativeContent,
            mark: item.incoming.mark,
          });
        }
      } else if (item.status === 'identical') {
        // Even if identical, if explicitly selected, can add as copy or skip
        toAdd.push({
          id: `prompt_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 6)}`,
          name: `${item.incoming.name} (Copy)`,
          content: item.incoming.content,
          negativeContent: item.incoming.negativeContent,
          mark: item.incoming.mark,
        });
      }
    });

    onApply({ toAdd, toUpdate });
    onClose();
  };

  const getTypeNameLabel = () => {
    if (type === 'master') return lang === 'en' ? 'Master Prompts' : 'マスタープロンプト';
    if (type === 'negative') return lang === 'en' ? 'Negative Prompts' : 'ネガティブプロンプト';
    return lang === 'en' ? 'Memos' : 'プロンプトメモ';
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-bg-panel border border-border-main shadow-2xl flex flex-col w-full max-w-5xl h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-3.5 bg-bg-panel border-b border-border-main flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-widest text-accent-main uppercase px-2 py-0.5 border border-border-main bg-bg-input">
                IMPORT COMPARISON
              </span>
              <h2 className="text-sm font-mono font-bold text-text-main">
                {getTypeNameLabel()} {lang === 'en' ? 'Comparison & Import' : '比較インポート'}
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

          {/* Subheader: Stats and Guide Bar */}
          <div className="px-4 py-2.5 bg-bg-input/60 border-b border-border-main flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-text-dim">
                {lang === 'en' ? 'FILE ITEMS:' : '取り込み対象:'}{' '}
                <strong className="text-text-main">{stats.total}</strong>
              </span>
              <span className="text-border-main">|</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <PlusCircle className="w-3 h-3" />
                {lang === 'en' ? 'NEW:' : '新規:'} {stats.newCount}
              </span>
              <span className="text-border-main">|</span>
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {lang === 'en' ? 'DIFF/CONFLICT:' : '変更・競合:'} {stats.conflictCount}
              </span>
              <span className="text-border-main">|</span>
              <span className="text-text-dim flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {lang === 'en' ? 'IDENTICAL:' : '同一:'} {stats.identicalCount}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-text-dim">{lang === 'en' ? 'SELECTED:' : '選択中:'}</span>
              <span className="px-2 py-0.5 bg-text-main text-bg-base font-bold">
                {stats.selectedCount} / {stats.total}
              </span>
            </div>
          </div>

          {/* Controls Bar: Filters & Quick Select & Search */}
          <div className="p-3 bg-bg-panel border-b border-border-main flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            {/* Filter Tabs */}
            <div className="flex items-center border border-border-main bg-bg-base text-[10px] font-mono">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 font-bold transition-colors ${
                  filterTab === 'all' ? 'bg-text-main text-bg-base' : 'text-text-dim hover:text-text-main'
                }`}
              >
                {lang === 'en' ? 'ALL' : 'すべて'} ({stats.total})
              </button>
              <button
                onClick={() => setFilterTab('conflict')}
                className={`px-3 py-1 border-l border-border-main font-bold transition-colors ${
                  filterTab === 'conflict' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'text-text-dim hover:text-amber-400'
                }`}
              >
                {lang === 'en' ? 'DIFF' : '変更・競合'} ({stats.conflictCount})
              </button>
              <button
                onClick={() => setFilterTab('new')}
                className={`px-3 py-1 border-l border-border-main font-bold transition-colors ${
                  filterTab === 'new' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'text-text-dim hover:text-emerald-400'
                }`}
              >
                {lang === 'en' ? 'NEW' : '新規'} ({stats.newCount})
              </button>
              <button
                onClick={() => setFilterTab('identical')}
                className={`px-3 py-1 border-l border-border-main font-bold transition-colors ${
                  filterTab === 'identical' ? 'bg-text-main text-bg-base' : 'text-text-dim hover:text-text-main'
                }`}
              >
                {lang === 'en' ? 'IDENTICAL' : '同一'} ({stats.identicalCount})
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <button
                onClick={() => handleSelectAll(true)}
                className="px-2 py-1 bg-bg-input border border-border-main text-text-dim hover:text-text-main hover:bg-bg-surface transition-colors"
              >
                {lang === 'en' ? 'Select All' : '全選択'}
              </button>
              <button
                onClick={() => handleSelectAll(false)}
                className="px-2 py-1 bg-bg-input border border-border-main text-text-dim hover:text-text-main hover:bg-bg-surface transition-colors"
              >
                {lang === 'en' ? 'Deselect All' : '全解除'}
              </button>
              <button
                onClick={() => handleSelectByStatus('new')}
                className="px-2 py-1 bg-bg-input border border-border-main text-emerald-500 hover:bg-emerald-500/10 transition-colors"
              >
                {lang === 'en' ? 'Select New' : '新規のみ選択'}
              </button>
              <button
                onClick={() => handleSelectByStatus('conflict')}
                className="px-2 py-1 bg-bg-input border border-border-main text-amber-500 hover:bg-amber-500/10 transition-colors"
              >
                {lang === 'en' ? 'Select Diff' : '変更のみ選択'}
              </button>
            </div>

            {/* Batch Resolution Option for Conflict */}
            {stats.conflictCount > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono ml-auto">
                <span className="text-text-dim">{lang === 'en' ? 'Diff action:' : '競合時の一括動作:'}</span>
                <div className="flex border border-border-main bg-bg-base">
                  <button
                    onClick={() => handleSetAllConflictResolution('overwrite')}
                    className={`px-2 py-1 transition-colors ${
                      defaultConflictResolution === 'overwrite' ? 'bg-text-main text-bg-base font-bold' : 'text-text-dim hover:text-text-main'
                    }`}
                  >
                    {lang === 'en' ? 'Overwrite' : '上書き'}
                  </button>
                  <button
                    onClick={() => handleSetAllConflictResolution('add_new')}
                    className={`px-2 py-1 border-l border-border-main transition-colors ${
                      defaultConflictResolution === 'add_new' ? 'bg-text-main text-bg-base font-bold' : 'text-text-dim hover:text-text-main'
                    }`}
                  >
                    {lang === 'en' ? 'Keep Both' : '別名追加'}
                  </button>
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="relative w-48 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-text-dim pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Filter list...' : '項目を検索...'}
                className="w-full bg-bg-input border border-border-main text-[10px] font-mono pl-7 pr-2 py-1 text-text-main focus:outline-none focus:border-border-hover"
              />
            </div>
          </div>

          {/* Comparison Table / List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-bg-base">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-text-dim font-mono text-xs">
                {lang === 'en' ? 'No items match the current filter.' : '該当する項目はありません。'}
              </div>
            ) : (
              filteredItems.map(item => {
                const isConflict = item.status === 'conflict';
                const isNew = item.status === 'new';
                const isIdentical = item.status === 'identical';

                return (
                  <div
                    key={item.id}
                    className={`border transition-colors ${
                      item.selected
                        ? isConflict
                          ? 'border-amber-500/50 bg-bg-panel'
                          : isNew
                          ? 'border-emerald-500/40 bg-bg-panel'
                          : 'border-border-hover bg-bg-panel'
                        : 'border-border-main/50 bg-bg-panel/60 opacity-60'
                    }`}
                  >
                    {/* Item Row Header */}
                    <div className="p-2.5 bg-bg-input/60 border-b border-border-main/70 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => handleToggleItem(item.id)}
                          className="text-text-main hover:text-accent-main transition-colors shrink-0"
                        >
                          {item.selected ? (
                            <CheckSquare className="w-4 h-4 text-accent-main" />
                          ) : (
                            <Square className="w-4 h-4 text-text-dim" />
                          )}
                        </button>

                        {/* Status Badge */}
                        {isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                            NEW (新規)
                          </span>
                        )}
                        {isConflict && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/40 shrink-0">
                            DIFF (変更・競合)
                          </span>
                        )}
                        {isIdentical && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider bg-bg-base text-text-dim border border-border-main shrink-0">
                            SAME (同一一致)
                          </span>
                        )}

                        {/* Item Name */}
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-text-main truncate">
                          {renderMarkSymbol(item.incoming.mark)}
                          <span className="truncate">{item.incoming.name}</span>
                        </div>
                      </div>

                      {/* Conflict Resolution Selector */}
                      {isConflict && (
                        <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
                          <span className="text-text-dim">{lang === 'en' ? 'Action:' : '取り込み方法:'}</span>
                          <div className="flex border border-border-main bg-bg-base">
                            <button
                              type="button"
                              onClick={() => handleSetResolution(item.id, 'overwrite')}
                              className={`px-2 py-0.5 font-bold transition-colors ${
                                item.resolution === 'overwrite'
                                  ? 'bg-amber-500/20 text-amber-400 border-r border-border-main'
                                  : 'text-text-dim hover:text-text-main border-r border-border-main'
                              }`}
                            >
                              {lang === 'en' ? 'Overwrite' : '上書き'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetResolution(item.id, 'add_new')}
                              className={`px-2 py-0.5 font-bold transition-colors ${
                                item.resolution === 'add_new'
                                  ? 'bg-text-main text-bg-base'
                                  : 'text-text-dim hover:text-text-main'
                              }`}
                            >
                              {lang === 'en' ? 'Keep Both' : '別名追加'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Item Body: Content Comparison */}
                    <div className="p-3 text-[11px] font-mono">
                      {isConflict && item.existing ? (
                        /* Side-by-side comparison */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Current / Existing Item */}
                          <div className="border border-border-main bg-bg-base p-2.5 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[10px] font-bold text-text-dim border-b border-border-main pb-1">
                              <span>【{lang === 'en' ? 'CURRENT IN APP' : '現在アプリ内にあるデータ'}】</span>
                              <span className="text-text-dim">{renderMarkSymbol(item.existing.mark)}{item.existing.name}</span>
                            </div>
                            <div className="text-text-main whitespace-pre-wrap break-all max-h-36 overflow-y-auto leading-relaxed bg-bg-input/40 p-1.5 border border-border-main/50">
                              {item.existing.content || <span className="text-text-dim italic">(空)</span>}
                            </div>
                            {item.existing.negativeContent !== undefined && (
                              <div className="mt-1 border-t border-border-main/50 pt-1">
                                <span className="text-[9px] text-red-400 font-bold block mb-0.5">NEGATIVE:</span>
                                <div className="text-red-300 whitespace-pre-wrap break-all max-h-24 overflow-y-auto leading-relaxed bg-red-950/20 p-1.5 border border-red-500/20">
                                  {item.existing.negativeContent || <span className="text-text-dim italic">(空)</span>}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Incoming / File Item */}
                          <div className="border border-amber-500/40 bg-bg-base p-2.5 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 border-b border-amber-500/30 pb-1">
                              <span>【{lang === 'en' ? 'FILE TO IMPORT' : 'ファイル内の取り込みデータ'}】</span>
                              <span className="text-amber-400">{renderMarkSymbol(item.incoming.mark)}{item.incoming.name}</span>
                            </div>
                            <div className="text-text-main whitespace-pre-wrap break-all max-h-36 overflow-y-auto leading-relaxed bg-amber-500/5 p-1.5 border border-amber-500/30">
                              {item.incoming.content || <span className="text-text-dim italic">(空)</span>}
                            </div>
                            {item.incoming.negativeContent !== undefined && (
                              <div className="mt-1 border-t border-amber-500/30 pt-1">
                                <span className="text-[9px] text-red-400 font-bold block mb-0.5">NEGATIVE:</span>
                                <div className="text-red-300 whitespace-pre-wrap break-all max-h-24 overflow-y-auto leading-relaxed bg-red-950/20 p-1.5 border border-red-500/20">
                                  {item.incoming.negativeContent || <span className="text-text-dim italic">(空)</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Single view for New or Identical */
                        <div className="border border-border-main bg-bg-base p-2.5 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-text-dim border-b border-border-main pb-1">
                            <span>
                              {isNew
                                ? (lang === 'en' ? 'NEW PROMPT TO ADD' : '新規追加される内容')
                                : (lang === 'en' ? 'IDENTICAL CONTENT (Already exists)' : '同一内容（すでに存在しています）')}
                            </span>
                            <span className="text-text-dim">{item.incoming.name}</span>
                          </div>
                          <div className="text-text-main whitespace-pre-wrap break-all max-h-32 overflow-y-auto leading-relaxed bg-bg-input/40 p-1.5 border border-border-main/50">
                            {item.incoming.content || <span className="text-text-dim italic">(空)</span>}
                          </div>
                          {item.incoming.negativeContent !== undefined && (
                            <div className="mt-1 border-t border-border-main/50 pt-1">
                              <span className="text-[9px] text-red-400 font-bold block mb-0.5">NEGATIVE:</span>
                              <div className="text-red-300 whitespace-pre-wrap break-all max-h-24 overflow-y-auto leading-relaxed bg-red-950/20 p-1.5 border border-red-500/20">
                                {item.incoming.negativeContent || <span className="text-text-dim italic">(空)</span>}
                              </div>
                            </div>
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
              <strong className="text-text-main">{stats.selectedCount} {lang === 'en' ? 'items' : '件'}</strong>
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
                  ? `Import Selected (${stats.selectedCount})`
                  : `選択した ${stats.selectedCount} 件をインポート`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
