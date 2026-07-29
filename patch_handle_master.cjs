const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleSaveAsMaster = \(name: string, content: string, isNegative: boolean, negativeContent\?: string\) => \{\n\s*if \(isNegative\) \{\n\s*handleAddNegative\(name, content\);\n\s*\} else \{\n\s*handleAddMaster\(name, content, negativeContent\);\n\s*\}\n\s*\};/;

const replace = `const handleSaveAsMaster = (name: string, content: string, isNegative: boolean, negativeContent?: string, isUpdate?: boolean) => {
    if (isUpdate) {
      if (isNegative && selectedNegativeId) {
        handleUpdateNegative(selectedNegativeId, { name, content });
      } else if (!isNegative && selectedMasterId) {
        handleUpdateMaster(selectedMasterId, { name, content, negativeContent });
      } else {
        if (isNegative) handleAddNegative(name, content);
        else handleAddMaster(name, content, negativeContent);
      }
    } else {
      if (isNegative) {
        handleAddNegative(name, content);
      } else {
        handleAddMaster(name, content, negativeContent);
      }
    }
  };`;

code = code.replace(regex, replace);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched handleSaveAsMaster");
