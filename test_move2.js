const currentText = "woman, solo, (cat:1.5), dog";
const start = 8; // inside solo
const end = 8;

let selStart = start;
let selEnd = end;
if (start === end) {
    const beforeStr = currentText.substring(0, start);
    const afterStr = currentText.substring(end);
    const commaBefore = beforeStr.lastIndexOf(',');
    const commaAfter = afterStr.indexOf(',');
    selStart = commaBefore === -1 ? 0 : commaBefore + 1;
    selEnd = commaAfter === -1 ? currentText.length : end + commaAfter;
    while (selStart < selEnd && currentText[selStart].match(/\s/)) selStart++;
    while (selEnd > selStart && currentText[selEnd - 1].match(/\s/)) selEnd--;
}
console.log('Selected:', currentText.substring(selStart, selEnd));
