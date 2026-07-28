const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexMoveSel = /  const handleMoveSelection = \(position: 'start' \| 'end'\) => \{[\s\S]*?  \};\n/m;
const regexMoveStep = /  const handleMoveSelectionStep = \(direction: 'left' \| 'right'\) => \{[\s\S]*?  \};\n/m;

const newMoveSel = `  const handleMoveSelection = (position: 'start' | 'end') => {
    const isPositive = activeEditor === 'positive';
    const textarea = isPositive ? positiveTextRef.current : negativeTextRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = isPositive ? editorText : negativeEditorText;

    // Tokenize text by commas, respecting parentheses
    const tokens: { text: string; start: number; end: number }[] = [];
    let currentStart = 0;
    let inParen = 0;
    for (let i = 0; i < currentText.length; i++) {
      if (currentText[i] === '(') inParen++;
      else if (currentText[i] === ')') inParen--;
      
      if (currentText[i] === ',' && inParen <= 0) {
        tokens.push({ text: currentText.substring(currentStart, i), start: currentStart, end: i });
        currentStart = i + 1;
      }
    }
    tokens.push({ text: currentText.substring(currentStart), start: currentStart, end: currentText.length });

    let selStart = start;
    let selEnd = end;
    if (start === end) {
      const activeToken = tokens.find(t => t.start <= start && t.end >= start) || tokens[tokens.length - 1];
      selStart = activeToken.start;
      selEnd = activeToken.end;
      while (selStart < selEnd && currentText[selStart].match(/\\s/)) selStart++;
      while (selEnd > selStart && currentText[selEnd - 1].match(/\\s/)) selEnd--;
      if (selStart >= selEnd) return;
    }
    
    const before = currentText.substring(0, selStart);
    const selected = currentText.substring(selStart, selEnd);
    const after = currentText.substring(selEnd);
    
    let remaining = before + after;
    remaining = remaining.replace(/\\s*,\\s*,/g, ',').replace(/^[\\s,]+|[\\s,]+$/g, '').trim();
    
    const newSelected = selected.replace(/^[\\s,]+|[\\s,]+$/g, '').trim();
    if (!newSelected) return;

    let newText = '';
    let newSelectionStart = 0;
    
    if (position === 'start') {
      newText = newSelected + (remaining ? ', ' + remaining : '');
      newSelectionStart = 0;
    } else {
      newText = (remaining ? remaining + ', ' : '') + newSelected;
      newSelectionStart = remaining ? remaining.length + 2 : 0;
    }
    
    const newSelectionEnd = newSelectionStart + newSelected.length;
    
    if (isPositive) {
      setEditorText(newText);
    } else {
      setNegativeEditorText(newText);
    }
    
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      }
    }, 0);
  };
`;

const newMoveStep = `  const handleMoveSelectionStep = (direction: 'left' | 'right') => {
    const isPositive = activeEditor === 'positive';
    const textarea = isPositive ? positiveTextRef.current : negativeTextRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = isPositive ? editorText : negativeEditorText;

    // Tokenize text by commas, respecting parentheses
    const tokens: { text: string; start: number; end: number }[] = [];
    let currentStart = 0;
    let inParen = 0;
    for (let i = 0; i < currentText.length; i++) {
      if (currentText[i] === '(') inParen++;
      else if (currentText[i] === ')') inParen--;
      
      if (currentText[i] === ',' && inParen <= 0) {
        tokens.push({ text: currentText.substring(currentStart, i), start: currentStart, end: i });
        currentStart = i + 1;
      }
    }
    tokens.push({ text: currentText.substring(currentStart), start: currentStart, end: currentText.length });

    let selStart = start;
    let selEnd = end;
    if (start === end) {
      const activeToken = tokens.find(t => t.start <= start && t.end >= start) || tokens[tokens.length - 1];
      selStart = activeToken.start;
      selEnd = activeToken.end;
      while (selStart < selEnd && currentText[selStart].match(/\\s/)) selStart++;
      while (selEnd > selStart && currentText[selEnd - 1].match(/\\s/)) selEnd--;
      if (selStart >= selEnd) return;
    }

    // Find selected tokens
    let startIndex = tokens.findIndex(t => t.end >= selStart && t.start <= selStart);
    let endIndex = tokens.findIndex(t => t.end >= (selEnd > selStart ? selEnd - 1 : selEnd) && t.start <= (selEnd > selStart ? selEnd - 1 : selEnd));
    
    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = tokens.length - 1;
    
    if (direction === 'left' && startIndex > 0) {
      const prev = tokens[startIndex - 1];
      const selected = tokens.slice(startIndex, endIndex + 1);
      tokens.splice(startIndex - 1, endIndex - startIndex + 2, ...selected, prev);
    } else if (direction === 'right' && endIndex < tokens.length - 1) {
      const next = tokens[endIndex + 1];
      const selected = tokens.slice(startIndex, endIndex + 1);
      tokens.splice(startIndex, endIndex - startIndex + 2, next, ...selected);
    } else {
      return; // Cannot move further
    }
    
    // Reconstruct text
    let newText = '';
    let newSelectionStart = -1;
    let newSelectionEnd = -1;
    const selectedTokensSet = new Set(tokens.slice(
      direction === 'left' ? startIndex - 1 : startIndex + 1,
      direction === 'left' ? endIndex : endIndex + 2
    ).slice(0, endIndex - startIndex + 1)); // Exact selected elements in new array
    
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      const cleanText = t.text.trim();
      if (!cleanText) continue;
      
      if (newText.length > 0) newText += ', ';
      
      const isSelected = selectedTokensSet.has(t);
      if (isSelected && newSelectionStart === -1) {
        newSelectionStart = newText.length;
      }
      
      newText += cleanText;
      
      if (isSelected) {
        newSelectionEnd = newText.length;
      }
    }
    
    if (isPositive) {
      setEditorText(newText);
    } else {
      setNegativeEditorText(newText);
    }
    
    setTimeout(() => {
      if (textarea && newSelectionStart !== -1) {
        textarea.focus();
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      }
    }, 0);
  };
`;

code = code.replace(regexMoveSel, newMoveSel);
code = code.replace(regexMoveStep, newMoveStep);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
