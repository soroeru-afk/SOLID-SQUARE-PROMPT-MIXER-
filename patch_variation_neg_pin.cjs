const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const oldBtns = `{part.isNegative ? (
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
                                  {part.isPinned ? (
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

const newBtns = `<div className="flex flex-col items-center justify-center -my-1 ml-1">
                                    {part.isNegative ? (
                                      <button 
                                        className="text-[8px] leading-none opacity-100 uppercase text-red-500 font-mono flex-shrink-0 py-1 px-1 font-bold hover:text-red-400"
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
                                        className="text-[8px] leading-none opacity-0 group-hover:opacity-100 uppercase text-text-dim font-mono flex-shrink-0 py-1 px-1 hover:text-red-400 font-bold"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (onTogglePartNegative) onTogglePartNegative(part.id);
                                        }}
                                        title="Mark as Negative Part"
                                      >
                                        NEG
                                      </button>
                                    )}
                                    {part.isPinned ? (
                                      <button 
                                        className="text-[8px] leading-none opacity-100 uppercase text-blue-400 font-mono flex-shrink-0 py-1 px-1 hover:text-blue-300"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onTogglePin(part.id);
                                        }}
                                      >
                                        ⭐
                                      </button>
                                    ) : (
                                      <button 
                                        className="text-[8px] leading-none opacity-0 group-hover:opacity-100 uppercase text-text-dim font-mono flex-shrink-0 py-1 px-1 hover:text-blue-400"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onTogglePin(part.id);
                                        }}
                                      >
                                        PIN
                                      </button>
                                    )}
                                  </div>`;

code = code.replace(oldBtns, newBtns);

const oldClass = "className={`p-2 rounded flex items-center space-x-2 cursor-pointer transition-colors group relative ${isSelected ? (part.isNegative ? 'bg-bg-surface border border-red-500/50 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' : 'bg-bg-surface border border-blue-500/30') : (part.isNegative ? 'bg-red-500/5 border border-red-500/30 hover:border-red-500/50' : 'bg-bg-input border border-border-main hover:border-border-hover')}`}";
const newClass = "className={`p-2 rounded flex items-center space-x-2 cursor-pointer transition-colors group relative ${isSelected ? (part.isNegative ? 'bg-red-500/20 border border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'bg-bg-surface border border-blue-500/30') : (part.isNegative ? 'bg-red-500/10 border border-red-500/40 hover:bg-red-500/20 hover:border-red-500/60' : 'bg-bg-input border border-border-main hover:border-border-hover')}`}";

code = code.replace(oldClass, newClass);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn layout and colors");
