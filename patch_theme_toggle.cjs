const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = "onClick={() => setTheme(t => t === 'dark' ? 'black' : t === 'black' ? 'red' : t === 'red' ? 'light' : t === 'light' ? 'navy' : t === 'navy' ? 'mono' : 'dark')}";
const newCode = "onClick={() => setTheme(t => t === 'dark' ? 'black' : t === 'black' ? 'light' : t === 'light' ? 'navy' : t === 'navy' ? 'mono' : t === 'mono' ? 'dark' : 'light')}";

code = code.replace(oldCode, newCode);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched theme toggle");
