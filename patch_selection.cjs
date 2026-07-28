const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const oldSelection = `      if (start === end) {
         const before = text.substring(0, start);
         const after = text.substring(end);
         const commaBefore = before.lastIndexOf(',');
         const commaAfter = after.indexOf(',');
         selStart = commaBefore === -1 ? 0 : commaBefore + 1;
         selEnd = commaAfter === -1 ? text.length : end + commaAfter;
         
         while(selStart < selEnd && text[selStart].match(/\\s/)) selStart++;
         while(selEnd > selStart && text[selEnd-1].match(/\\s/)) selEnd--;
         if (selStart >= selEnd) return;
      }`;

const newSelection = `      // Always expand to commas
      const before = text.substring(0, start);
      const after = text.substring(end === start ? end : end - 1);
      const commaBefore = before.lastIndexOf(',');
      const commaAfter = after.indexOf(',');
      selStart = commaBefore === -1 ? 0 : commaBefore + 1;
      selEnd = commaAfter === -1 ? text.length : (end === start ? end : end - 1) + commaAfter;
      
      while(selStart < selEnd && text[selStart].match(/\\s/)) selStart++;
      while(selEnd > selStart && text[selEnd-1].match(/\\s/)) selEnd--;
      if (selStart >= selEnd) return;`;

code = code.replace(oldSelection, newSelection);
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
