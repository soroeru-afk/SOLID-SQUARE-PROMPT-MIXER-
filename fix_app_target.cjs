const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /      if \(targetToReplace\) \{[\s\S]*?\} else \{/g;

const replacement = `      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
        result = result.replace(targetRegex, posStr);
      } else {`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed targetToReplace logic.');
