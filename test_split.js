const str = "british woman, (creamy white skin, elegant sharp facial features:1.3), ";
const splitRespectingParens = (text) => {
  const parts = [];
  let current = '';
  let parenDepth = 0;
  let bracketDepth = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '(') parenDepth++;
    else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
    else if (char === '[') bracketDepth++;
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    
    if (char === ',' && parenDepth === 0 && bracketDepth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
};
console.log(splitRespectingParens(str));
