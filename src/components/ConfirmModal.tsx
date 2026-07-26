import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, t } from '../i18n';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  lang: Language;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel, lang }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-bg-panel border border-border-main rounded-lg shadow-xl p-6 w-full max-w-sm m-4"
          >
            <p className="text-text-main text-sm font-mono mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-bg-input hover:bg-border-main text-text-dim text-[11px] font-mono rounded transition-colors"
              >
                {t('cancel', lang)}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded transition-colors"
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
