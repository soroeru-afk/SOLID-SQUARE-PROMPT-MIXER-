import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, t } from '../i18n';

interface SavePartModalProps {
  isOpen: boolean;
  content: string;
  categories: [string, number][]; // [category, section]
  onConfirm: (name: string, category: string, section: number) => void;
  onCancel: () => void;
  lang: Language;
}

export const SavePartModal: React.FC<SavePartModalProps> = ({ isOpen, content, categories, onConfirm, onCancel, lang }) => {
  const [name, setName] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      if (categories.length > 0 && !selectedCat) {
        setSelectedCat(`${categories[0][1]}:${categories[0][0]}`);
      }
    }
  }, [isOpen, categories]);

  const handleConfirm = () => {
    if (!name.trim() || !selectedCat) return;
    const [sectionStr, ...catParts] = selectedCat.split(':');
    const categoryName = catParts.join(':');
    onConfirm(name, categoryName, Number(sectionStr));
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
            <h2 className="text-text-main text-sm font-mono font-bold">{t('save_as_part', lang)}</h2>
            
            <div>
              <label className="block text-[10px] font-mono text-text-dim mb-1">{t('name', lang)}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('name', lang)}
                className="w-full bg-bg-input border border-border-main text-text-main text-xs font-mono p-2 rounded focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-text-dim mb-1">{t('category', lang)}</label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full bg-bg-input border border-border-main text-text-main text-xs font-mono p-2 rounded focus:outline-none focus:border-blue-500"
              >
                {categories.map(([cat, sec]) => (
                  <option key={`${sec}:${cat}`} value={`${sec}:${cat}`}>
                    {t(cat as any, lang) || cat} (Section {sec})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-text-dim mb-1">{t('content', lang)}</label>
              <div className="bg-bg-base border border-border-main text-text-dim text-[10px] font-mono p-2 rounded max-h-20 overflow-y-auto whitespace-pre-wrap">
                {content}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-bg-input hover:bg-border-main text-text-dim text-[11px] font-mono rounded transition-colors"
              >
                {t('cancel', lang)}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!name.trim() || !selectedCat}
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
