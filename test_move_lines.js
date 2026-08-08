const moveLines = (text, start, end, dir) => {
  let lineStart = text.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = text.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = text.length;
  const selectedLines = text.substring(lineStart, lineEnd);
  
  if (dir === 'up' && lineStart > 0) {
    const prevLineStart = text.lastIndexOf('\n', lineStart - 2) + 1;
    const prevLine = text.substring(prevLineStart, lineStart - 1);
    const newText = text.substring(0, prevLineStart) + selectedLines + '\n' + prevLine + text.substring(lineEnd);
    return { newText, selStart: prevLineStart, selEnd: prevLineStart + selectedLines.length };
  } else if (dir === 'down' && lineEnd < text.length) {
    let nextLineEnd = text.indexOf('\n', lineEnd + 1);
    if (nextLineEnd === -1) nextLineEnd = text.length;
    const nextLine = text.substring(lineEnd + 1, nextLineEnd);
    const newText = text.substring(0, lineStart) + nextLine + '\n' + selectedLines + text.substring(nextLineEnd);
    const selStart = lineStart + nextLine.length + 1;
    return { newText, selStart, selEnd: selStart + selectedLines.length };
  }
  return { newText: text, selStart: start, selEnd: end };
};

let text = "Line 1\nLine 2\nLine 3\nLine 4";
// Select inside Line 2
let start = 8; // "Line 2"
console.log("Original:\n" + text);
console.log("Up:", moveLines(text, start, start, 'up'));
console.log("Down:", moveLines(text, start, start, 'down'));

// Select across Line 2 and Line 3
start = 8;
let end = 15;
console.log("Multi Up:", moveLines(text, start, end, 'up'));
console.log("Multi Down:", moveLines(text, start, end, 'down'));
