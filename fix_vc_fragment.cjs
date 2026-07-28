const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// 1. Revert the previous broken ternary logic at the start
code = code.replace(/\{activeTab === 'parts' \? \(\n      <div className="p-4 flex-1/, "{activeTab === 'parts' ? (\n      <>\n      <div className=\"p-4 flex-1");

// 2. We also need to close the fragment at the end. 
// My previous code was:
// {onDeleteAll && ( ... )}
// ) : ( children )}
// We need it to be:
// {onDeleteAll && ( ... )}
// </>
// ) : ( children )}
code = code.replace(/(\s*\)\})(\n      \) : \(\n        children\n      \}\})/, "$1\n      </>$2");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
