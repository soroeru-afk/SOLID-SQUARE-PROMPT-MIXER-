const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexFunc = `  const escapeRegExp = (str: string) => {
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

code = code.replace(/  const handleReplace = \(\) => {[\s\S]*?const handleReplaceAll = \(\) => {[\s\S]*?  };/, regexFunc);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Updated PreviewColumn replace functions");
