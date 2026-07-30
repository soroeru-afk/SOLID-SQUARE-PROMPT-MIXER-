const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

code = code.replace(
  /import \{ Pencil, Trash2, Check, X, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Plus, List, ArrowRightToLine, ArrowLeftToLine \} from 'lucide-react';/,
  "import { Pencil, Trash2, Check, X, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Plus, List, ArrowRightToLine, ArrowLeftToLine, Copy } from 'lucide-react';"
);

code = code.replace(
  /onUpdateNegative: \(id: string, updates: Partial<MasterPrompt>\) => void;/,
  "onUpdateNegative: (id: string, updates: Partial<MasterPrompt>) => void;\n  onDuplicate?: (id: string) => void;\n  onDuplicateNegative?: (id: string) => void;"
);

code = code.replace(
  /onUpdate, onUpdateNegative, onDelete, onDeleteNegative/,
  "onUpdate, onUpdateNegative, onDuplicate, onDuplicateNegative, onDelete, onDeleteNegative"
);

code = code.replace(
  /const currentOnReorder = activeTab === 'master' \? onReorder : onReorderNegative;/,
  "const currentOnReorder = activeTab === 'master' ? onReorder : onReorderNegative;\n  const currentOnDuplicate = activeTab === 'master' ? onDuplicate : onDuplicateNegative;"
);

code = code.replace(
  /<button \n\s*onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); if \(onCopyToPart\) onCopyToPart\(item\); \}\}\n\s*className="p-1\.5 text-text-dim hover:text-green-400 hover:bg-bg-input transition-colors"\n\s*title="Copy to Variation Parts"\n\s*><ArrowRightToLine className="w-3 h-3" \/><\/button>/,
  `<button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (currentOnDuplicate) currentOnDuplicate(item.id); }}
                  className="p-1.5 text-text-dim hover:text-text-main hover:bg-bg-input transition-colors"
                  title="Duplicate"
                ><Copy className="w-3 h-3" /></button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onCopyToPart) onCopyToPart(item); }}
                  className="p-1.5 text-text-dim hover:text-green-400 hover:bg-bg-input transition-colors"
                  title="Copy to Variation Parts"
                ><ArrowRightToLine className="w-3 h-3" /></button>`
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn");
