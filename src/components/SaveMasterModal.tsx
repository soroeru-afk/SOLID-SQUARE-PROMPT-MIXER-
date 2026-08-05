import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, t } from '../i18n';

interface SaveMasterModalProps {
  isOpen: boolean;
  content?: string;
  negativeContent?: string;
  defaultTitle?: string;
  items?: {name: string, content: string}[];
  isNegative: boolean;
  selectedId?: string | null;
  selectedName?: string;
  onConfirm: (title: string, content: string, isNegative: boolean, items?: {name: string, content: string}[], negativeContent?: string, isUpdate?: boolean) => void;
  onCancel: () => void;
  lang: Language;
  mixerCategories?: {id: string, label: string}[];
  onCopyToMixer?: (categoryId: string, title: string, content: string, items?: {name: string, content: string}[]) => void;
}

export const SaveMasterModal: React.FC<SaveMasterModalProps> = ({ isOpen, content, negativeContent, defaultTitle, items, isNegative, selectedId, selectedName, onConfirm, onCancel, lang, mixerCategories, onCopyToMixer }) => {
  const [title, setTitle] = useState('');
  const [selectedMixerCat, setSelectedMixerCat] = useState('');
  const isBulk = items && items.length > 0;

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle || '');
      if (mixerCategories && mixerCategories.length > 0) {
        setSelectedMixerCat(mixerCategories[0].id);
      }
    }
  }, [isOpen, defaultTitle, mixerCategories]);

  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-bg-panel border border-border-main rounded-lg shadow-xl p-6 w-full max-w-sm m-4 flex flex-col gap-4"
          >
            <h2 className="text-text-main text-sm font-mono font-bold">
              {isBulk ? `Save ${items.length} items to ${isNegative ? 'negative prompts' : 'master prompts'}` : (negativeContent !== undefined ? t('save_as_set', lang) : (isNegative ? t('save_to_negative', lang) : t('save_as_master', lang)))}
            </h2>
            
            {!isBulk && (
              <div>
                <label className="block text-[10px] font-mono text-text-dim mb-1">{t('name', lang)}</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full bg-bg-input border border-border-main text-text-main text-xs font-mono p-2 rounded focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>
            )}

            {!isBulk && (
              <div>
                <label className="block text-[10px] font-mono text-text-dim mb-1">{t('content', lang)}</label>
                <div className="bg-bg-base border border-border-main text-text-dim text-[10px] font-mono p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {content}
                </div>
                {negativeContent !== undefined && (
                  <>
                    <label className="block text-[10px] font-mono text-text-dim mb-1 mt-2">NEGATIVE PROMPT</label>
                    <div className="bg-bg-base border border-border-main text-text-dim text-[10px] font-mono p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {negativeContent}
                    </div>
                  </>
                )}
              </div>
            )}


            {mixerCategories && mixerCategories.length > 0 && onCopyToMixer && (
              <div className="mt-4 pt-4 border-t border-border-main">
                <label className="block text-[10px] font-mono text-text-dim mb-1">Copy to Prompt Mixer (プロンプトミキサーへコピー)</label>
                <div className="flex gap-2">
                  <select
                    value={selectedMixerCat}
                    onChange={(e) => setSelectedMixerCat(e.target.value)}
                    className="flex-1 bg-bg-input border border-border-main text-text-main text-xs font-mono p-2 rounded focus:outline-none focus:border-blue-500"
                  >
                    {mixerCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (selectedMixerCat) {
                        onCopyToMixer(selectedMixerCat, title.trim() || defaultTitle || '', content || '', items);
                      }
                    }}
                    disabled={!isBulk && !title.trim()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-[11px] font-mono font-bold rounded transition-colors disabled:opacity-50"
                  >
                    {t('copy', lang)}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-bg-input hover:bg-border-main text-text-dim text-[11px] font-mono rounded transition-colors"
              >
                {t('cancel', lang)}
              </button>
              {selectedId && !isBulk && (
                <button
                  onClick={() => onConfirm(title.trim() || selectedName || '', content || '', isNegative, items, negativeContent, true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono font-bold rounded transition-colors"
                  title={`Update: ${selectedName}`}
                >
                  {t('update_current', lang)}
                </button>
              )}
              <button
                onClick={() => onConfirm(title.trim(), content || '', isNegative, items, negativeContent, false)}
                disabled={!isBulk && !title.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded transition-colors disabled:opacity-50"
              >
                {t('save_as_new', lang)}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
