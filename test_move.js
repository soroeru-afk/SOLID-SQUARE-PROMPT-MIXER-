const currentText = "woman, solo, cat, dog";
const start = 8; // middle of solo
const end = 8;
let selStart = start;
let selEnd = end;
if (start === end) {
    const before = currentText.substring(0, start);
    const after = currentText.substring(end);
    const commaBefore = before.lastIndexOf(',');
    const commaAfter = after.indexOf(',');
    selStart = commaBefore === -1 ? 0 : commaBefore + 1;
    selEnd = commaAfter === -1 ? currentText.length : end + commaAfter;
    while(selStart < selEnd && currentText[selStart].match(/\s/)) selStart++;
    while(selEnd > selStart && currentText[selEnd-1].match(/\s/)) selEnd--;
}
console.log(currentText.substring(selStart, selEnd));
