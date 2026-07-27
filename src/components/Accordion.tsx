import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

interface AccordionProps {
  title: string;
  badge?: number;
  defaultOpen?: boolean;
  onAdd?: (e: React.MouseEvent) => void;
  expandId?: number;
  collapseId?: number;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, badge, defaultOpen = false, onAdd, expandId, collapseId, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (expandId && expandId > 0) setIsOpen(true);
  }, [expandId]);

  useEffect(() => {
    if (collapseId && collapseId > 0) setIsOpen(false);
  }, [collapseId]);

  return (
    <div className="bg-bg-panel border border-border-main rounded-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 hover:bg-bg-input transition-colors border-b border-border-main group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="bg-slate-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none min-w-[20px] text-center shadow-sm">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <div 
              onClick={onAdd}
              className="opacity-0 group-hover:opacity-100 px-1.5 py-0.5 flex items-center gap-1 hover:text-blue-400 text-text-dim transition-opacity border border-transparent hover:border-blue-500/30 rounded"
            >
              <Plus className="w-3 h-3" />
              <span className="text-[9px] font-mono whitespace-nowrap">NEW</span>
            </div>
          )}
          <div className={`w-3 h-3 border border-border-hover rounded-sm flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-bg-surface' : ''}`}> 
             <div className={`w-1 h-1 ${isOpen ? 'bg-blue-500' : 'bg-gray-500'}`} />
          </div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="p-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
