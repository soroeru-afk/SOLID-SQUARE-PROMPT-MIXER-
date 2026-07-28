const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Fix applyTransformToSelectionOrAll
code = code.replace(
  "const isPositive = activeMasterTab === 'master';",
  "const isPositive = activeEditor === 'positive';"
);

// 2. Add applyTransformToSelectionOrWord and handleEmphasize functions
const newFunctions = `
  const applyTransformToSelectionOrWord = (transformFn: (text: string) => string) => {
    const isPositive = activeEditor === 'positive';
    const textarea = isPositive ? positiveTextRef.current : negativeTextRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = isPositive ? editorText : negativeEditorText;
      
      let selStart = start;
      let selEnd = end;
      
      if (start === end) {
         const before = text.substring(0, start);
         const after = text.substring(end);
         const commaBefore = before.lastIndexOf(',');
         const commaAfter = after.indexOf(',');
         selStart = commaBefore === -1 ? 0 : commaBefore + 1;
         selEnd = commaAfter === -1 ? text.length : end + commaAfter;
         
         while(selStart < selEnd && text[selStart].match(/\\s/)) selStart++;
         while(selEnd > selStart && text[selEnd-1].match(/\\s/)) selEnd--;
         if (selStart >= selEnd) return;
      }
      
      const selectedText = text.substring(selStart, selEnd);
      const transformedText = transformFn(selectedText);
      
      const newText = text.substring(0, selStart) + transformedText + text.substring(selEnd);
      
      if (isPositive) {
        setEditorText(cleanString(newText));
      } else {
        setNegativeEditorText(cleanString(newText));
      }
      
      setTimeout(() => {
        if (textarea) {
          textarea.setSelectionRange(selStart, selStart + transformedText.length);
          textarea.focus();
        }
      }, 0);
    }
  };

  const handleEmphasizeWrap = (open: string, close: string) => {
    applyTransformToSelectionOrWord((text) => {
      return \`\${open}\${text}\${close}\`;
    });
  };

  const handleEmphasizeChange = (delta: number) => {
    applyTransformToSelectionOrWord((text) => {
      let match = text.match(/^\\((.+?):([0-9.]+)\\)$/);
      if (match) {
        let newWeight = parseFloat(match[2]) + delta;
        newWeight = Math.max(0.01, Math.round(newWeight * 100) / 100);
        return \`(\${match[1]}:\${newWeight})\`;
      }
      match = text.match(/^\\((.+?)\\)$/);
      if (match) {
        let newWeight = 1.1 + delta;
        newWeight = Math.max(0.01, Math.round(newWeight * 100) / 100);
        return \`(\${match[1]}:\${newWeight})\`;
      }
      let newWeight = 1.0 + delta;
      newWeight = Math.max(0.01, Math.round(newWeight * 100) / 100);
      return \`(\${text}:\${newWeight})\`;
    });
  };
`;

code = code.replace(
  "const handleFormatComma = () => {",
  newFunctions + "\n  const handleFormatComma = () => {"
);

// 3. Add UI buttons
const newButtons = `
        <div className="w-px h-6 bg-border-main mx-1"></div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => handleEmphasizeWrap('(', ')')}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Wrap in ()"
          >()</button>
          <button 
            onClick={() => handleEmphasizeWrap('[', ']')}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Wrap in []"
          >[]</button>
          <button 
            onClick={() => handleEmphasizeChange(0.1)}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Increase weight +0.1"
          >+0.1</button>
          <button 
            onClick={() => handleEmphasizeChange(-0.1)}
            className="px-2 py-1 bg-bg-input hover:bg-border-main text-[10px] font-mono border border-border-hover rounded text-text-dim"
            title="Decrease weight -0.1"
          >-0.1</button>
        </div>
`;

code = code.replace(
  "<button \n          onClick={handleUppercase}",
  newButtons + "\n        <button \n          onClick={handleUppercase}"
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
