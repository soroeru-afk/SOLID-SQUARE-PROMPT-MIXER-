const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
        // Like Replace All, we just do a string replacement.
        // Wait, what if posStr has trailing spaces/commas and replaces a word? 
        // e.g. "japanese girl" replaced with "british girl, "
        // To be safe, we might just insert posStr directly.
        // But let's trim posStr so it doesn't leave dangling commas inside if there was no comma originally.
        // Actually, if posStr has a comma, we should just let it be, just like Replace All.
        result = result.replace(targetRegex, posStr);
      } else {`;

// Replace lines 554 through 562
const lines = code.split('\n');
const newLines = [];
let inside = false;
for (let i = 0; i < lines.length; i++) {
    if (i === 553 && lines[i].includes('if (targetToReplace) {')) {
        inside = true;
        newLines.push(replacement);
        continue;
    }
    if (inside) {
        if (i === 561 && lines[i].includes('} else {')) {
            inside = false;
        }
        continue;
    }
    newLines.push(lines[i]);
}

fs.writeFileSync('src/App.tsx', newLines.join('\n'));
console.log("Done");
