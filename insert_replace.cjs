const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const lines = code.split('\n');
const toInsert = `  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
  };

  const handleReplace = () => {
    if (!findText) return;
    const regex = new RegExp(escapeRegExp(findText), 'i');
    setEditorText(prev => prev.replace(regex, replaceText));
    setNegativeEditorText(prev => prev.replace(regex, replaceText));
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const regex = new RegExp(escapeRegExp(findText), 'gi');
    setEditorText(prev => prev.replace(regex, replaceText));
    setNegativeEditorText(prev => prev.replace(regex, replaceText));
  };`;

lines.splice(229, 0, ...toInsert.split('\n'));
fs.writeFileSync('src/components/PreviewColumn.tsx', lines.join('\n'));
console.log('Fixed PreviewColumn.tsx');
