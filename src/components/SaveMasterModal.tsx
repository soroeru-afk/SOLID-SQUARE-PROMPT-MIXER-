import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, t } from '../i18n';

interface SaveMasterModalProps {
  isOpen: boolean;
  content?: string;
  defaultTitle?: string;
  items?: {name: string, content: string}[];
  isNegative: boolean;
  onConfirm: (title: string, content: string, isNegative: boolean, items?: {name: string, content: string}[]) => void;
  onCancel: () => void;
  lang: Language;
}

export const SaveMasterModal: React.FC<SaveMasterModalProps> = ({ isOpen, content, defaultTitle, items, isNegative, onConfirm, onCancel, lang }) => {
  const [title, setTitle] = useState('');
  const isBulk = items && items.length > 0;

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle || '');
    }
  }, [isOpen, defaultTitle]);

  const handleConfirm = () => {
    if (!isBulk && !title.trim()) return;
    onConfirm(title.trim(), content || '', isNegative, items);
  };

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
              {isBulk ? `Save ${items.length} items to ${isNegative ? 'negative prompts' : 'master prompts'}` : (isNegative ? t('save_to_negative', lang) : t('save_as_master', lang))}
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
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-bg-input hover:bg-border-main text-text-dim text-[11px] font-mono rounded transition-colors"
              >
                {t('cancel', lang)}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isBulk && !title.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded transition-colors disabled:opacity-50"
              >
                {t('confirm', lang)}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
