const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /import \{ Pencil, Trash2, Check, X, Plus, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, ArrowLeftToLine \} from 'lucide-react';/,
  "import { Pencil, Trash2, Check, X, Plus, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, ArrowLeftToLine, Copy } from 'lucide-react';"
);

code = code.replace(
  /onUpdate: \(id: string, updates: Partial<VariationPart>\) => void;/,
  "onUpdate: (id: string, updates: Partial<VariationPart>) => void;\n  onDuplicate?: (id: string) => void;"
);

code = code.replace(
  /onUpdate, onDelete, onDeleteAll/,
  "onUpdate, onDuplicate, onDelete, onDeleteAll"
);

code = code.replace(
  /<button \n\s*onClick=\{\(e\) => \{ e\.preventDefault\(\); e\.stopPropagation\(\); if \(onCopyToMaster\) onCopyToMaster\(part\); \}\}\n\s*className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-green-400 transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main"\n\s*title="Copy to Master Prompts"\n\s*>\n\s*<ArrowLeftToLine className="w-3 h-3" \/>\n\s*<\/button>/,
  `<button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onDuplicate) onDuplicate(part.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-blue-400 transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onCopyToMaster) onCopyToMaster(part); }}
                                    className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-green-400 transition-opacity p-1 bg-bg-panel rounded shadow-sm border border-border-main"
                                    title="Copy to Master Prompts"
                                  >
                                    <ArrowLeftToLine className="w-3 h-3" />
                                  </button>`
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn");
