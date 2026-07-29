const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/Array\.from\(selectedPartIds\)/g, "Array.from<string>(selectedPartIds)");

fs.writeFileSync('src/App.tsx', code);
console.log("Patched Array.from");
