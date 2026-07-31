const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// The file got mangled. Let's find the whole block and fix it.
const badBlock = `    if (!findText) return;
    setEditorText(prev => prev.replace(findText, replaceText));
    setNegativeEditorText(prev => prev.replace(findText, replaceText));
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    setEditorText(prev => prev.replaceAll(findText, replaceText));
    setNegativeEditorText(prev => prev.replaceAll(findText, replaceText));
  };');

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

const goodBlock = `  const escapeRegExp = (str: string) => {
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

if (code.includes('  const handleReplace = () => {\n    if (!findText) return;\n    setEditorText(prev => prev.replace(findText, replaceText));')) {
  // It seems the original block is still there, and the appended block is there too.
  // We can just use a regex to replace everything from the first handleReplace to the last handleReplaceAll
  code = code.replace(/  const handleReplace = \(\) => \{[\s\S]*?const handleReplaceAll = \(\) => \{[\s\S]*?  \};\n/g, ''); // Delete all of them
  
  // Wait, that might delete too much. Let's just locate where it's supposed to be and insert.
}
