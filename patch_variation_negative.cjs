const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /onTogglePin: \(id: string\) => void;/,
  "onTogglePin: (id: string) => void;\n  onTogglePartNegative?: (id: string) => void;"
);

code = code.replace(
  /onTogglePin, onAdd/,
  "onTogglePin, onTogglePartNegative, onAdd"
);

const oldClass = "className={`p-2 rounded flex items-center space-x-2 cursor-pointer transition-colors group relative ${\\s*isSelected \\? 'bg-bg-surface border border-blue-500\\/30' : 'bg-bg-input border border-border-main hover:border-border-hover'\\s*}`}";

const newClass = "className={`p-2 rounded flex items-center space-x-2 cursor-pointer transition-colors group relative ${" +
  "isSelected ? (part.isNegative ? 'bg-bg-surface border border-red-500/50 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' : 'bg-bg-surface border border-blue-500/30') : (part.isNegative ? 'bg-red-500/5 border border-red-500/30 hover:border-red-500/50' : 'bg-bg-input border border-border-main hover:border-border-hover')}`}";

code = code.replace(new RegExp(oldClass, "m"), newClass);

const pinButton = `{part.isPinned ? (
                                    <button 
                                      className="text-[9px] opacity-100 uppercase text-blue-400 font-mono flex-shrink-0 p-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePin(part.id);
                                      }}
                                    >
                                      ⭐
                                    </button>
                                  ) : (
                                    <button 
                                      className="text-[9px] opacity-0 group-hover:opacity-100 uppercase text-text-dim font-mono flex-shrink-0 p-1 hover:text-blue-400"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePin(part.id);
                                      }}
                                    >
                                      PIN
                                    </button>
                                  )}`;

const pinAndNegativeButtons = `{part.isNegative ? (
                                    <button 
                                      className="text-[9px] opacity-100 uppercase text-red-500 font-mono flex-shrink-0 p-1 font-bold"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onTogglePartNegative) onTogglePartNegative(part.id);
                                      }}
                                      title="Remove Negative Tag"
                                    >
                                      NEG
                                    </button>
                                  ) : (
                                    <button 
                                      className="text-[9px] opacity-0 group-hover:opacity-100 uppercase text-text-dim font-mono flex-shrink-0 p-1 hover:text-red-400 font-bold"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onTogglePartNegative) onTogglePartNegative(part.id);
                                      }}
                                      title="Mark as Negative Part"
                                    >
                                      NEG
                                    </button>
                                  )}
                                  ${pinButton}`;

code = code.replace(pinButton, pinAndNegativeButtons);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn for negative parts");
