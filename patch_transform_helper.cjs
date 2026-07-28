const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexTransform = /  const applyTransformToSelectionOrWord = \(transformFn: \(text: string\) => string\) => \{[\s\S]*?  \};\n/m;

const newTransform = `  const applyTransformToSelectionOrWord = (transformFn: (text: string) => string) => {
    const isPositive = activeEditor === 'positive';
    const textarea = isPositive ? positiveTextRef.current : negativeTextRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = isPositive ? editorText : negativeEditorText;
      
      let selStart = start;
      let selEnd = end;
      
      // Tokenize text by commas, respecting parentheses
      const tokens: { text: string; start: number; end: number }[] = [];
      let currentStart = 0;
      let inParen = 0;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') inParen++;
        else if (text[i] === ')') inParen--;
        
        if (text[i] === ',' && inParen <= 0) {
          tokens.push({ text: text.substring(currentStart, i), start: currentStart, end: i });
          currentStart = i + 1;
        }
      }
      tokens.push({ text: text.substring(currentStart), start: currentStart, end: text.length });
      
      const activeToken = tokens.find(t => t.start <= start && t.end >= start) || tokens[tokens.length - 1];
      let tStart = activeToken.start;
      let tEnd = activeToken.end;

      if (start === end) {
        selStart = tStart;
        selEnd = tEnd;
      } else {
        const startToken = tokens.find(t => t.start <= start && t.end >= start) || tokens[0];
        const endToken = tokens.find(t => t.start <= (end > 0 ? end - 1 : 0) && t.end >= (end > 0 ? end - 1 : 0)) || tokens[tokens.length - 1];
        selStart = startToken.start;
        selEnd = endToken.end;
      }
      
      while(selStart < selEnd && text[selStart].match(/\\s/)) selStart++;
      while(selEnd > selStart && text[selEnd-1].match(/\\s/)) selEnd--;
      if (selStart >= selEnd) return;
      
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
`;

code = code.replace(regexTransform, newTransform);
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
