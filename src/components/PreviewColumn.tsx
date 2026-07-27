import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Save, PlusSquare, Undo2, Redo2, ChevronLeft, ChevronRight, RotateCcw, ArrowDown, ArrowUp, Copy } from 'lucide-react';
import { Language, t } from '../i18n';
import { SavePartModal } from './SavePartModal';
import { SaveMasterModal } from './SaveMasterModal';

interface PreviewColumnProps {
  editorText: string;
  setEditorText: React.Dispatch<React.SetStateAction<string>>;
  negativeEditorText: string;
  setNegativeEditorText: React.Dispatch<React.SetStateAction<string>>;
  setPositiveCursorPos: (pos: number) => void;
  setNegativeCursorPos: (pos: number) => void;
  activeEditor: 'positive' | 'negative';
  setActiveEditor: (editor: 'positive' | 'negative') => void;
  onSaveAsMaster?: (title: string, content: string, isNegative: boolean) => void;
  onSaveAsPart?: (name: string, content: string, category: string, section: number, items?: {name: string, content: string}[]) => void;
  uniqueCategories?: [string, number][];
  activeMasterTab?: 'master' | 'negative';
  lang: Language;
  paperMode?: boolean;
  theme?: string;
  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  autoOptimize?: boolean;
  onToggleAutoOptimize?: () => void;
}

export const PreviewColumn: React.FC<PreviewColumnProps> = ({ 
  editorText, setEditorText,
  negativeEditorText, setNegativeEditorText,
  activeEditor, setActiveEditor, setPositiveCursorPos, setNegativeCursorPos,
  onSaveAsMaster,
  onSaveAsPart,
  uniqueCategories = [],
  activeMasterTab = 'master',
  lang,
  paperMode = false,
  theme = 'dark',
  undo,
  redo,
  canUndo = false,
  canRedo = false,
  autoOptimize = true,
  onToggleAutoOptimize
}) => {
  const [copied, setCopied] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  
  const [isSavePartModalOpen, setIsSavePartModalOpen] = useState(false);
  const [savePartContent, setSavePartContent] = useState('');
  const [savePartDefaultName, setSavePartDefaultName] = useState('');
  const [savePartItems, setSavePartItems] = useState<{name: string, content: string}[] | undefined>(undefined);

  const [isSaveMasterModalOpen, setIsSaveMasterModalOpen] = useState(false);
  const [saveMasterContent, setSaveMasterContent] = useState('');
  const [saveMasterDefaultTitle, setSaveMasterDefaultTitle] = useState('');
  const [saveMasterIsNegative, setSaveMasterIsNegative] = useState(false);
  const [saveMasterItems, setSaveMasterItems] = useState<{name: string, content: string}[] | undefined>(undefined);

  const parsePromptBlocks = (text: string): { name: string; content: string }[] => {
    const trimmed = text.trim();
    if (!trimmed) return [];

    // 1. Extract blocks starting with ▼ if ▼ exists anywhere in the text
    if (trimmed.includes('▼')) {
      const blocks = trimmed.split(/(?=^▼|\n▼)/).filter(b => b.trim());
      const items: { name: string; content: string }[] = [];
      blocks.forEach(block => {
        const match = block.trim().match(/^▼\s*([^\n]+)\n+([\s\S]*)$/);
        if (match) {
          items.push({ name: match[1].trim(), content: match[2].trim() });
        } else {
          const matchSingle = block.trim().match(/^▼\s*([^\n]+)$/);
          if (matchSingle) {
            items.push({ name: matchSingle[1].trim(), content: '' });
          } else {
            const lines = block.trim().split('\n');
            const name = lines[0].replace(/^▼\s*/, '').trim();
            const content = lines.slice(1).join('\n').trim();
            items.push({ name, content });
          }
        }
      });
      if (items.length > 0) return items;
    }

    // 2. Separate by empty lines (\n\s*\n+)
    const emptyLineBlocks = trimmed.split(/\n\s*\n+/).map(b => b.trim()).filter(Boolean);
    if (emptyLineBlocks.length > 1) {
      const items: { name: string; content: string }[] = [];
      emptyLineBlocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length > 1) {
          const name = lines[0];
          const content = lines.slice(1).join('\n');
          items.push({ name, content });
        } else if (lines.length === 1) {
          const line = lines[0];
          const colonIdx = line.search(/[:：]/);
          if (colonIdx > 0 && colonIdx < line.length - 1) {
            items.push({
              name: line.slice(0, colonIdx).trim(),
              content: line.slice(colonIdx + 1).trim()
            });
          } else {
            const title = line.length > 20 ? line.slice(0, 20) + '...' : line;
            items.push({ name: title, content: line });
          }
        }
      });
      if (items.length > 0) return items;
    }

    // 3. Single block with multiple lines where every line has "name: content"
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 1) {
      const colonLines = lines.filter(l => /[:：]/.test(l));
      if (colonLines.length === lines.length) {
        const items: { name: string; content: string }[] = [];
        lines.forEach(line => {
          const colonIdx = line.search(/[:：]/);
          items.push({
            name: line.slice(0, colonIdx).trim(),
            content: line.slice(colonIdx + 1).trim()
          });
        });
        if (items.length > 0) return items;
      }
    }

    return [];
  };

  const handleSavePartClick = (isNegativeTextarea: boolean) => {
    const text = isNegativeTextarea ? negativeEditorText : editorText;
    if (!text.trim()) return;
    
    const items = parsePromptBlocks(text);
    if (items.length > 0) {
      setSavePartItems(items);
      setSavePartContent('');
      setSavePartDefaultName('');
      setIsSavePartModalOpen(true);
    } else {
      const firstLine = text.trim().split('\n')[0];
      const title = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine;
      setSavePartItems(undefined);
      setSavePartContent(text.trim());
      setSavePartDefaultName(title);
      setIsSavePartModalOpen(true);
    }
  };

  const handleCopy = async (target: 'main' | 'negative' | 'all') => {
    try {
      const cleanEditor = cleanString(editorText);
      const cleanNegative = cleanString(negativeEditorText);
      
      // Update editor state with cleaned version as well
      setEditorText(cleanEditor);
      if (negativeEditorText) setNegativeEditorText(cleanNegative);

      let textToCopy = '';
      if (target === 'main') {
        if (!cleanEditor) return;
        textToCopy = cleanEditor;
      } else if (target === 'negative') {
        if (!cleanNegative) return;
        textToCopy = cleanNegative;
      } else {
        if (!cleanEditor && !cleanNegative) return;
        textToCopy = cleanEditor;
        if (cleanNegative) {
          textToCopy += (textToCopy ? `\n\nNegative Prompt:\n` : `Negative Prompt:\n`) + cleanNegative;
        }
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleReplace = () => {
    if (!findText) return;
    setEditorText(prev => prev.replace(findText, replaceText));
    setNegativeEditorText(prev => prev.replace(findText, replaceText));
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    setEditorText(prev => prev.replaceAll(findText, replaceText));
    setNegativeEditorText(prev => prev.replaceAll(findText, replaceText));
  };

  const cleanString = (text: string, force: boolean = false) => {
    if (!autoOptimize && !force) return text;
    return text
      .split('\n')
      .map(line => 
        line
          .replace(/[\u3000]/g, ' ')
          .replace(/[ \t]+/g, ' ')
          .replace(/[ \t]+,/g, ',')
          .replace(/,+/g, ',')
          .replace(/,[ \t]*,/g, ',')
          .replace(/,([^\s])/g, ', $1')
          .trim()
      )
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^[\s,]+|[\s,]+$/g, '')
      .trim();
  };

  const handleCleanText = () => {
    setEditorText(prev => cleanString(prev, true));
    setNegativeEditorText(prev => cleanString(prev, true));
  };

  const handleFormatComma = () => {
    setEditorText(prev => cleanString(prev.replace(/\./g, ',')));
    setNegativeEditorText(prev => cleanString(prev.replace(/\./g, ',')));
  };

  const handleSaveMasterClick = (isNegativeTextarea: boolean, saveAsNegative?: boolean) => {
    if (!onSaveAsMaster) return;
    const text = isNegativeTextarea ? negativeEditorText : editorText;
    const targetIsNegative = saveAsNegative !== undefined ? saveAsNegative : isNegativeTextarea;
    if (!text.trim()) return;

    const items = parsePromptBlocks(text);
    if (items.length > 0) {
      setSaveMasterItems(items);
      setSaveMasterContent('');
      setSaveMasterDefaultTitle('');
      setSaveMasterIsNegative(targetIsNegative);
      setIsSaveMasterModalOpen(true);
    } else {
      const firstLine = text.trim().split('\n')[0];
      const title = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine;
      setSaveMasterItems(undefined);
      setSaveMasterContent(text.trim());
      setSaveMasterDefaultTitle(title);
      setSaveMasterIsNegative(targetIsNegative);
      setIsSaveMasterModalOpen(true);
    }
  };

  const handleMergeDupes = () => {
    const processMerge = (text: string) => {
      const parts = text.split(',').map(s => s.trim()).filter(Boolean);
      const counts = new Map<string, number>();
      
      parts.forEach(part => {
        let cleanPart = part;
        let weight = 1;
        const match = part.match(/^\((.+?)[: ]x?([0-9.]+)\)$/);
        if (match) {
          cleanPart = match[1].trim();
          weight = parseFloat(match[2]);
        }
        counts.set(cleanPart, (counts.get(cleanPart) || 0) + weight);
      });
      
      const result = [];
      for (const [part, count] of counts.entries()) {
        if (count > 1) {
          const numStr = Number.isInteger(count) ? count.toString() : count.toFixed(1);
          result.push(`(${part}:${numStr})`);
        } else {
          result.push(part);
        }
      }
      return cleanString(result.join(', '));
    };

    const processScale = (text: string) => {
      const regex = /\(([^)]+?)[: ]([0-9.]+)\)/g;
      let match;
      let minWeight = Infinity;
      let maxWeight = -Infinity;
      
      // 1. 最小値と最大値を見つける
      while ((match = regex.exec(text)) !== null) {
        const weight = parseFloat(match[2]);
        if (!isNaN(weight)) {
          if (weight < minWeight) minWeight = weight;
          if (weight > maxWeight) maxWeight = weight;
        }
      }

      // 差がない、または見つからない場合はそのまま返す
      if (minWeight === Infinity || minWeight === maxWeight) {
        return text;
      }

      // 2. 対象の文字列だけを置換する
      return text.replace(/\(([^)]+?)[: ]([0-9.]+)\)/g, (fullMatch, content, weightStr) => {
        const weight = parseFloat(weightStr);
        if (isNaN(weight)) return fullMatch;
        
        const scaledWeight = 0.1 + ((weight - minWeight) / (maxWeight - minWeight)) * (1.4 - 0.1);
        const finalWeightStr = parseFloat(scaledWeight.toFixed(2)).toString();
        
        return `(${content}:${finalWeightStr})`;
      });
    };

    const processBoth = (text: string) => processScale(processMerge(text));

    if (activeMasterTab === 'master') {
      setEditorText(prev => processBoth(prev));
    } else if (activeMasterTab === 'negative') {
      setNegativeEditorText(prev => processBoth(prev));
    }
  };

  const handleAdjustWeights = (delta: number) => {
    const isPositive = activeMasterTab === 'master';
    const textarea = isPositive ? positiveTextRef.current : negativeTextRef.current;
    if (!textarea) return;

    const text = isPositive ? editorText : negativeEditorText;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const isSelected = start !== end;

    const processText = (targetText: string) => {
      return targetText.replace(/\(([^)]+?)[: ]([0-9.]+)\)/g, (fullMatch, content, weightStr) => {
        const weight = parseFloat(weightStr);
        if (isNaN(weight)) return fullMatch;
        const newWeight = Math.max(0.01, weight + delta);
        const finalWeightStr = parseFloat(newWeight.toFixed(2)).toString();
        return `(${content}:${finalWeightStr})`;
      });
    };

    if (isSelected) {
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end);
      
      const newSelected = processText(selected);
      const newText = before + newSelected + after;
      
      if (isPositive) {
        setEditorText(newText);
      } else {
        setNegativeEditorText(newText);
      }
      
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(start, start + newSelected.length);
        }
      }, 0);
    } else {
      if (isPositive) {
        setEditorText(processText(text));
      } else {
        setNegativeEditorText(processText(text));
      }
    }
  };

  const handleOptimizeSyntax = () => {
    const process = (text: string) => {
      if (/\({2,}/.test(text)) {
        return text.replace(/(\(+)([^():]+?)(\)+)/g, (match, p1, p2, p3) => {
          const depth = Math.min(p1.length, p3.length);
          if (depth > 1) {
            const extraLeft = p1.slice(depth);
            const extraRight = p3.slice(0, p3.length - depth);
            const val = 1.0 + (depth * 0.1); 
            return `${extraLeft}(${p2}:${val.toFixed(1)})${extraRight}`;
          }
          return match;
        });
      } else {
        return text.replace(/\(([^():]+?):([0-9.]+)\)/g, (match, p1, p2) => {
          const val = parseFloat(p2);
          if (val > 1.0) {
            const depth = Math.round((val - 1.0) * 10);
            if (depth > 1 && depth <= 10) {
              return '('.repeat(depth) + p1 + ')'.repeat(depth);
            }
          }
          return match;
        });
      }
    };
    
    if (activeMasterTab === 'master') {
      setEditorText(prev => cleanString(process(prev)));
    } else if (activeMasterTab === 'negative') {
      setNegativeEditorText(prev => cleanString(process(prev)));
    }
  };

  const handleFormatHyphen = () => {
    if (activeMasterTab === 'master') {
      setEditorText(prev => cleanString(prev.replace(/\./g, ' - ')));
    } else if (activeMasterTab === 'negative') {
      setNegativeEditorText(prev => cleanString(prev.replace(/\./g, ' - ')));
    }
  };

  const handleUppercase = () => {
    if (activeMasterTab === 'master') {
      setEditorText(prev => cleanString(prev.toUpperCase()));
    } else if (activeMasterTab === 'negative') {
      setNegativeEditorText(prev => cleanString(prev.toUpperCase()));
    }
  };

  const handleLowercase = () => {
    if (activeMasterTab === 'master') {
      setEditorText(prev => cleanString(prev.toLowerCase()));
    } else if (activeMasterTab === 'negative') {
      setNegativeEditorText(prev => cleanString(prev.toLowerCase()));
    }
  };

  const [editorFontSize, setEditorFontSize] = useState(14);
  const [editorFontFamily, setEditorFontFamily] = useState('font-mono');
  
  const [negativeHeight, setNegativeHeight] = useState(120);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = negativeHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = dragStartY.current - e.clientY;
      const newHeight = Math.max(60, Math.min(800, dragStartHeight.current + delta));
      setNegativeHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const positiveHighlightRef = useRef<HTMLDivElement>(null);
  const negativeHighlightRef = useRef<HTMLDivElement>(null);
  const positiveTextRef = useRef<HTMLTextAreaElement>(null);
  const negativeTextRef = useRef<HTMLTextAreaElement>(null);

  const handleMoveSelection = (position: 'start' | 'end') => {
    const isPositive = activeEditor === 'positive';
    const textarea = isPositive ? positiveTextRef.current : negativeTextRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;
    
    const currentText = isPositive ? editorText : negativeEditorText;
    const before = currentText.substring(0, start);
    const selected = currentText.substring(start, end);
    const after = currentText.substring(end);
    
    let remaining = before + after;
    remaining = remaining.replace(/\s*,\s*,/g, ',').replace(/^[\s,]+|[\s,]+$/g, '').trim();
    
    const newSelected = selected.replace(/^[\s,]+|[\s,]+$/g, '').trim();
    if (!newSelected) return;

    let newText = '';
    let newSelectionStart = 0;
    
    if (position === 'start') {
      newText = newSelected + (remaining ? ', ' + remaining : '');
      newSelectionStart = 0;
    } else {
      newText = (remaining ? remaining + ', ' : '') + newSelected;
      newSelectionStart = remaining ? remaining.length + 2 : 0;
    }
    
    const newSelectionEnd = newSelectionStart + newSelected.length;
    
    if (isPositive) {
      setEditorText(newText);
    } else {
      setNegativeEditorText(newText);
    }
    
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      }
    }, 0);
  };

  const handleMoveSelectionStep = (direction: 'left' | 'right') => {
    const isPositive = activeEditor === 'positive';
    const textarea = isPositive ? positiveTextRef.current : negativeTextRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;
    
    const currentText = isPositive ? editorText : negativeEditorText;
    
    // Tokenize text by commas, respecting parentheses
    const tokens: { text: string; start: number; end: number }[] = [];
    let currentStart = 0;
    let inParen = 0;
    for (let i = 0; i < currentText.length; i++) {
      if (currentText[i] === '(') inParen++;
      else if (currentText[i] === ')') inParen--;
      
      if (currentText[i] === ',' && inParen <= 0) {
        tokens.push({ text: currentText.substring(currentStart, i), start: currentStart, end: i });
        currentStart = i + 1;
      }
    }
    tokens.push({ text: currentText.substring(currentStart), start: currentStart, end: currentText.length });
    
    // Find selected tokens
    let startIndex = tokens.findIndex(t => t.end >= start && t.start <= start);
    let endIndex = tokens.findIndex(t => t.end >= (end > start ? end - 1 : end) && t.start <= (end > start ? end - 1 : end));
    
    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = tokens.length - 1;
    
    if (direction === 'left' && startIndex > 0) {
      const prev = tokens[startIndex - 1];
      const selected = tokens.slice(startIndex, endIndex + 1);
      tokens.splice(startIndex - 1, endIndex - startIndex + 2, ...selected, prev);
    } else if (direction === 'right' && endIndex < tokens.length - 1) {
      const next = tokens[endIndex + 1];
      const selected = tokens.slice(startIndex, endIndex + 1);
      tokens.splice(startIndex, endIndex - startIndex + 2, next, ...selected);
    } else {
      return; // Cannot move further
    }
    
    // Reconstruct text
    let newText = '';
    let newSelectionStart = -1;
    let newSelectionEnd = -1;
    const selectedTokensSet = new Set(tokens.slice(
      direction === 'left' ? startIndex - 1 : startIndex + 1,
      direction === 'left' ? endIndex : endIndex + 2
    ).slice(0, endIndex - startIndex + 1)); // Exact selected elements in new array
    
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      const cleanText = t.text.trim();
      if (!cleanText) continue;
      
      if (newText.length > 0) newText += ', ';
      
      const isSelected = selectedTokensSet.has(t);
      if (isSelected && newSelectionStart === -1) {
        newSelectionStart = newText.length;
      }
      
      newText += cleanText;
      
      if (isSelected) {
        newSelectionEnd = newText.length;
      }
    }
    
    if (isPositive) {
      setEditorText(newText);
    } else {
      setNegativeEditorText(newText);
    }
    
    setTimeout(() => {
      if (textarea && newSelectionStart !== -1) {
        textarea.focus();
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      }
    }, 0);
  };

  const handleMoveTextBetweenEditors = (direction: 'down' | 'up') => {
    if (direction === 'down') {
      const textarea = positiveTextRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) return;
      const selectedText = editorText.substring(start, end).trim();
      const newEditorText = editorText.substring(0, start) + editorText.substring(end);
      setEditorText(cleanString(newEditorText));
      
      const newNegativeText = negativeEditorText ? `${negativeEditorText}, ${selectedText}` : selectedText;
      setNegativeEditorText(cleanString(newNegativeText));
    } else {
      const textarea = negativeTextRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) return;
      const selectedText = negativeEditorText.substring(start, end).trim();
      const newNegativeText = negativeEditorText.substring(0, start) + negativeEditorText.substring(end);
      setNegativeEditorText(cleanString(newNegativeText));
      
      const newEditorText = editorText ? `${editorText}, ${selectedText}` : selectedText;
      setEditorText(cleanString(newEditorText));
    }
  };

  const handleCopyTextBetweenEditors = (direction: 'down' | 'up') => {
    if (direction === 'down') {
      const textarea = positiveTextRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) return;
      const selectedText = editorText.substring(start, end).trim();
      
      const newNegativeText = negativeEditorText ? `${negativeEditorText}, ${selectedText}` : selectedText;
      setNegativeEditorText(cleanString(newNegativeText));
    } else {
      const textarea = negativeTextRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) return;
      const selectedText = negativeEditorText.substring(start, end).trim();
      
      const newEditorText = editorText ? `${editorText}, ${selectedText}` : selectedText;
      setEditorText(cleanString(newEditorText));
    }
  };

  const renderHighlightedText = (text: string) => {
    const isLight = paperMode || theme === 'light' || theme === 'paper';
    const highlightColorClass = isLight ? 'text-[#059669] font-bold drop-shadow-sm' : 'text-[#34d399] drop-shadow-sm';
    
    const parts = text.split(/(\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('(') && part.endsWith(')')) {
        return <span key={i} className={highlightColorClass}>{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <div className="p-3 border-b border-border-main flex items-center justify-between bg-bg-panel shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-text-main font-bold uppercase tracking-widest">{t('output_synthesis', lang)}</span>
          <button 
            onClick={onToggleAutoOptimize}
            className={`px-2 py-0.5 text-[9px] font-mono border rounded transition-colors outline-none cursor-pointer ${autoOptimize ? 'border-text-main text-text-main' : 'border-text-dim text-text-dim hover:border-text-main hover:text-text-main'}`}
          >
            {t(autoOptimize ? 'auto_optimize_on' : 'auto_optimize_off', lang)}
          </button>
        </div>
        <span className="text-[9px] text-text-dim font-mono">CHAR: {editorText.length} / 4096</span>
      </div>
      
      {/* Editor Toolbar (Find/Replace) */}
      <div className="p-2 border-b border-border-main bg-bg-base flex flex-wrap items-center gap-2 shrink-0">
        <input 
          type="text" 
          placeholder={t('find', lang)} 
          value={findText}
          onChange={e => setFindText(e.target.value)}
          className="bg-bg-input border border-border-main text-[11px] font-mono px-3 py-1.5 rounded focus:outline-none focus:border-blue-500 text-text-main placeholder-gray-600 flex-1 min-w-[120px]"
        />
        <input 
          type="text" 
          placeholder={t('replace', lang)} 
          value={replaceText}
          onChange={e => setReplaceText(e.target.value)}
          className="bg-bg-input border border-border-main text-[11px] font-mono px-3 py-1.5 rounded focus:outline-none focus:border-blue-500 text-text-main placeholder-gray-600 flex-1 min-w-[120px]"
        />
        <button 
          onClick={handleReplace}
          className="px-3 py-1.5 bg-bg-surface hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
        >
          {t('replace', lang)}
        </button>
        <button 
          onClick={handleReplaceAll}
          className="px-3 py-1.5 bg-bg-surface hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
        >
          {t('replace_all', lang)}
        </button>
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <button 
          onClick={handleMergeDupes}
          className={`px-3 py-1.5 text-[10px] font-mono border rounded transition-colors ${
            theme === 'light' 
              ? 'bg-[#3b5323]/10 hover:bg-[#3b5323]/20 border-[#3b5323]/60 text-[#3b5323]' 
              : 'bg-[#7a9a5a]/10 hover:bg-[#7a9a5a]/20 border-[#7a9a5a]/50 text-[#9bb87d]'
          }`}
          title="Merge duplicate phrases and normalize ratios"
        >
          {t('merge_dupes', lang)}
        </button>
        <div className="flex items-center space-x-1 px-2 py-1 bg-bg-input border border-border-main rounded shrink-0">
          <span className="text-[10px] font-mono text-text-dim pr-1">{t('global_weight', lang)}</span>
          <button 
            onClick={() => handleAdjustWeights(-0.1)}
            className="px-2 py-0.5 bg-bg-surface hover:bg-blue-500/10 text-[12px] font-mono border border-blue-500/50 rounded text-blue-500 transition-colors"
            title="Decrease weight by 0.1 (applies to selection or all)"
          >
            -0.1
          </button>
          <button 
            onClick={() => handleAdjustWeights(0.1)}
            className="px-2 py-0.5 bg-bg-surface hover:bg-red-500/10 text-[12px] font-mono border border-red-500/50 rounded text-red-500 transition-colors"
            title="Increase weight by 0.1 (applies to selection or all)"
          >
            +0.1
          </button>
        </div>
        <button 
          onClick={handleOptimizeSyntax}
          className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
          title="Optimize prompt weights syntax"
        >
          {t('optimize_syntax', lang)}
        </button>
        <button 
          onClick={handleCleanText}
          className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
          title="Clean spaces and commas"
        >
          {t('clean_text', lang)}
        </button>
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <button 
          onClick={handleFormatComma}
          className="px-3 py-1 bg-bg-input hover:bg-border-main font-mono border border-border-hover rounded transition-colors flex items-center justify-center gap-1.5"
          title="Replace periods with commas"
        >
          <span className="text-[12px] font-bold bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-text-main">.</span>
          <span className="text-[10px] text-text-dim leading-none opacity-80">→</span>
          <span className="text-[12px] font-bold bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-text-main">,</span>
        </button>
        <button 
          onClick={handleFormatHyphen}
          className="px-3 py-1 bg-bg-input hover:bg-border-main font-mono border border-border-hover rounded transition-colors flex items-center justify-center gap-1.5"
          title="Replace periods with hyphens"
        >
          <span className="text-[12px] font-bold bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-text-main">.</span>
          <span className="text-[10px] text-text-dim leading-none opacity-80">→</span>
          <span className="text-[12px] font-bold bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-text-main">-</span>
        </button>
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 bg-bg-input hover:bg-border-main disabled:opacity-50 disabled:cursor-not-allowed border border-border-hover rounded text-text-dim transition-colors flex items-center justify-center"
          title={t('undo', lang)}
        >
          <Undo2 size={12} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 bg-bg-input hover:bg-border-main disabled:opacity-50 disabled:cursor-not-allowed border border-border-hover rounded text-text-dim transition-colors flex items-center justify-center"
          title={t('redo', lang)}
        >
          <Redo2 size={12} />
        </button>
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <button 
          onClick={() => handleMoveSelection('start')}
          className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
          title={t('move_to_front_tooltip', lang)}
        >
          {t('move_to_front', lang)}
        </button>
        <button 
          onClick={() => handleMoveSelectionStep('left')}
          className="p-1.5 bg-bg-input hover:bg-border-main border border-border-hover rounded text-text-dim transition-colors flex items-center justify-center"
          title={t('move_left', lang)}
        >
          <ChevronLeft size={12} />
        </button>
        <button 
          onClick={() => handleMoveSelectionStep('right')}
          className="p-1.5 bg-bg-input hover:bg-border-main border border-border-hover rounded text-text-dim transition-colors flex items-center justify-center"
          title={t('move_right', lang)}
        >
          <ChevronRight size={12} />
        </button>
        <button 
          onClick={() => handleMoveSelection('end')}
          className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
          title={t('move_to_back_tooltip', lang)}
        >
          {t('move_to_back', lang)}
        </button>
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <button 
          onClick={handleUppercase}
          className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
        >
          {t('uppercase', lang)}
        </button>
        <button 
          onClick={handleLowercase}
          className="px-3 py-1.5 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim transition-colors"
        >
          {t('lowercase', lang)}
        </button>
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setEditorFontSize(s => Math.max(8, s - 1))}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
          >A-</button>
          <span className="text-[10px] font-mono text-text-main w-4 text-center">{editorFontSize}</span>
          <button 
            onClick={() => setEditorFontSize(s => Math.min(24, s + 1))}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
          >A+</button>
        </div>
        <select 
          value={editorFontFamily}
          onChange={e => setEditorFontFamily(e.target.value)}
          className="bg-bg-input border border-border-main text-[10px] font-mono text-text-main rounded px-2 py-1.5 outline-none cursor-pointer uppercase font-bold tracking-wider hover:bg-border-main transition-colors shrink-0"
        >
          <option value="font-mono">Mono</option>
          <option value="font-sans">Sans</option>
          <option value="font-serif">Serif</option>
          <option value="font-[Meiryo,sans-serif]">Meiryo</option>
        </select>
        <button 
          onClick={() => {            setEditorText('');            setNegativeEditorText('');          }}
          className={`ml-auto px-3 py-1.5 border rounded text-[10px] font-mono transition-colors flex items-center gap-1 shrink-0 ${
            theme === 'light'
              ? 'bg-gray-200 hover:bg-gray-300 text-black border-gray-400 font-bold'
              : 'bg-transparent hover:bg-white/10 text-white border-white/50 font-bold'
          }`}
        >
          <Trash2 className="w-3 h-3" /> {t('clear_all', lang)}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-bg-panel flex flex-col gap-4">
        <div className={`flex-1 border border-border-main rounded-lg flex flex-col relative min-h-[100px] transition-colors ${paperMode ? 'bg-[#f4f4f5] border-gray-300 shadow-inner' : 'bg-bg-base'}`}>
          <div className="absolute top-2 left-3 right-2 flex justify-between items-center pointer-events-none">
            <span className={`text-[9px] font-mono font-bold uppercase ${paperMode ? 'text-gray-400' : 'text-text-dim/50'}`}>PROMPT</span>
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="text-[8px] text-text-dim/50 font-mono hidden sm:inline-block">{t('save_master_hint', lang)}</span>
              <button 
                onClick={() => handleSaveMasterClick(false, activeMasterTab === 'negative')}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <Save className="w-3 h-3" /> {activeMasterTab === 'negative' ? t('save_to_negative', lang) : t('save_as_master', lang)}
              </button>
              <button 
                onClick={() => handleSavePartClick(false)}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <PlusSquare className="w-3 h-3" /> {t('save_as_part', lang)}
              </button>
            </div>
          </div>
          <div className="flex-1 relative flex flex-col mt-6">
            <div 
              ref={positiveHighlightRef}
              className={`absolute inset-0 p-4 pt-2 leading-relaxed whitespace-pre-wrap break-words overflow-auto pointer-events-none ${editorFontFamily} ${paperMode ? 'text-gray-800' : 'text-text-dim'}`}
              style={{ fontSize: `${editorFontSize}px` }}
              aria-hidden="true"
            >
              {editorText ? renderHighlightedText(editorText) : <span className="opacity-50">{t('placeholder', lang)}</span>}
            </div>
            <textarea
              ref={positiveTextRef}
              value={editorText}
              onChange={(e) => {
                setEditorText(e.target.value);
                setActiveEditor('positive');
                setPositiveCursorPos(e.target.selectionStart);
              }}
              onSelect={(e) => {
                setActiveEditor('positive');
                setPositiveCursorPos(e.currentTarget.selectionStart);
              }}
              onScroll={(e) => {
                if (positiveHighlightRef.current) {
                  positiveHighlightRef.current.scrollTop = e.currentTarget.scrollTop;
                  positiveHighlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}
              style={{ fontSize: `${editorFontSize}px` }}
              className={`absolute inset-0 w-full h-full p-4 pt-2 ${editorFontFamily} leading-relaxed overflow-y-auto whitespace-pre-wrap selection:bg-blue-500/30 selection:text-text-main bg-transparent text-transparent caret-text-main outline-none resize-none`}
              spellCheck={false}
            />
          </div>
        </div>
        
        {/* Move/Copy Text Buttons & Resizer */}
        <div className="flex justify-center -my-3 relative z-10">
          <div 
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 cursor-row-resize flex items-center justify-center group" 
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          >
            <div className={`w-full h-px ${isResizing ? 'bg-accent-main' : 'bg-transparent group-hover:bg-border-main'} transition-colors`} />
          </div>

          <div className="flex gap-2 bg-bg-panel p-1 rounded-full border border-border-main shadow-sm relative z-20">
            <button 
              onClick={() => handleCopyTextBetweenEditors('down')}
              className="px-2 py-1 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center gap-1 text-[9px] font-mono"
              title={t('copy_to_negative', lang)}
            >
              <Copy size={12} /> <ArrowDown size={12} />
            </button>
            <button 
              onClick={() => handleMoveTextBetweenEditors('down')}
              className="p-1.5 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center"
              title={t('move_to_negative', lang)}
            >
              <ArrowDown size={14} />
            </button>
            <div className="w-px h-6 bg-border-main my-auto mx-1"></div>
            <button 
              onClick={() => handleMoveTextBetweenEditors('up')}
              className="p-1.5 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center"
              title={t('move_to_positive', lang)}
            >
              <ArrowUp size={14} />
            </button>
            <button 
              onClick={() => handleCopyTextBetweenEditors('up')}
              className="px-2 py-1 bg-bg-input hover:bg-border-main rounded-full text-text-dim hover:text-text-main transition-colors border border-border-hover flex items-center justify-center gap-1 text-[9px] font-mono"
              title={t('copy_to_positive', lang)}
            >
              <Copy size={12} /> <ArrowUp size={12} />
            </button>
          </div>
        </div>

        <div 
          className={`border border-border-main rounded-lg flex flex-col shrink-0 relative transition-colors ${paperMode ? 'bg-[#f4f4f5] border-gray-300 shadow-inner' : 'bg-bg-base'}`}
          style={{ height: `${negativeHeight}px` }}
        >
          <div className="absolute top-2 left-3 right-2 flex justify-between items-center pointer-events-none">
            <span className={`text-[9px] font-mono font-bold uppercase ${paperMode ? 'text-gray-400' : 'text-text-dim/50'}`}>NEGATIVE PROMPT</span>
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="text-[8px] text-text-dim/50 font-mono hidden sm:inline-block">{t('save_master_hint', lang)}</span>
              <button 
                onClick={() => handleSaveMasterClick(true)}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <Save className="w-3 h-3" /> {t('save_as_master', lang)}
              </button>
              <button 
                onClick={() => handleSavePartClick(true)}
                className="flex items-center gap-1 px-2 py-1 bg-bg-input hover:bg-border-main border border-border-hover rounded text-[9px] font-mono text-text-dim transition-colors"
              >
                <PlusSquare className="w-3 h-3" /> {t('save_as_part', lang)}
              </button>
            </div>
          </div>
          <div className="flex-1 relative flex flex-col mt-6">
            <div 
              ref={negativeHighlightRef}
              className={`absolute inset-0 p-4 pt-2 leading-relaxed whitespace-pre-wrap break-words overflow-auto pointer-events-none ${editorFontFamily} ${paperMode ? 'text-gray-800' : 'text-text-dim'}`}
              style={{ fontSize: `${editorFontSize}px` }}
              aria-hidden="true"
            >
              {negativeEditorText ? renderHighlightedText(negativeEditorText) : <span className="opacity-50">Negative prompt...</span>}
            </div>
            <textarea
              ref={negativeTextRef}
              value={negativeEditorText}
              onChange={(e) => {
                setNegativeEditorText(e.target.value);
                setActiveEditor('negative');
                setNegativeCursorPos(e.target.selectionStart);
              }}
              onSelect={(e) => {
                setActiveEditor('negative');
                setNegativeCursorPos(e.currentTarget.selectionStart);
              }}
              onScroll={(e) => {
                if (negativeHighlightRef.current) {
                  negativeHighlightRef.current.scrollTop = e.currentTarget.scrollTop;
                  negativeHighlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}
              style={{ fontSize: `${editorFontSize}px` }}
              className={`absolute inset-0 w-full h-full p-4 pt-2 ${editorFontFamily} leading-relaxed overflow-y-auto whitespace-pre-wrap selection:bg-red-500/30 selection:text-text-main bg-transparent text-transparent caret-text-main outline-none resize-none`}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
        
      <div className="bg-bg-panel p-2 shrink-0 border-t border-border-main">
        <div className="flex gap-2 w-full">
          <button 
            onClick={() => handleCopy('main')}
            className="flex-1 py-2.5 transition-all font-mono font-bold text-xs rounded border bg-bg-surface hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 border-border-hover active:scale-[0.98] text-text-main cursor-pointer"
          >
            {t('copy_main', lang)}
          </button>
          <button 
            onClick={() => handleCopy('negative')}
            className="flex-1 py-2.5 transition-all font-mono font-bold text-xs rounded border bg-bg-surface hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 border-border-hover active:scale-[0.98] text-text-main cursor-pointer"
          >
            {t('copy_negative_only', lang)}
          </button>
          <button 
            onClick={() => handleCopy('all')}
            className="flex-1 py-2.5 transition-all font-mono font-bold text-xs rounded border bg-bg-surface hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 border-border-hover active:scale-[0.98] text-text-main cursor-pointer"
          >
            {t('copy_all', lang)}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-4 bg-bg-surface text-text-main px-4 py-2 rounded shadow-lg text-[10px] font-mono font-bold flex items-center gap-2 border border-border-main"
          >
            {t('copied', lang)}
          </motion.div>
        )}
      </AnimatePresence>

      <SavePartModal
        isOpen={isSavePartModalOpen}
        content={savePartContent}
        defaultName={savePartDefaultName}
        items={savePartItems}
        categories={uniqueCategories}
        onConfirm={(name, category, section, items) => {
          if (onSaveAsPart) {
            onSaveAsPart(name, savePartContent, category, section, items);
          }
          setIsSavePartModalOpen(false);
        }}
        onCancel={() => setIsSavePartModalOpen(false)}
        lang={lang}
      />
      <SaveMasterModal
        isOpen={isSaveMasterModalOpen}
        content={saveMasterContent}
        defaultTitle={saveMasterDefaultTitle}
        items={saveMasterItems}
        isNegative={saveMasterIsNegative}
        onConfirm={(title, content, isNegative, items) => {
          if (onSaveAsMaster) {
            if (items && items.length > 0) {
              items.forEach(item => {
                onSaveAsMaster(item.name, item.content, isNegative);
              });
            } else {
              onSaveAsMaster(title, content, isNegative);
            }
          }
          setIsSaveMasterModalOpen(false);
        }}
        onCancel={() => setIsSaveMasterModalOpen(false)}
        lang={lang}
      />
    </>
  );
};
