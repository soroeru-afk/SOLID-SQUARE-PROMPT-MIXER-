const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  const handleMixAttributes = useCallback\([\s\S]*?const handleTogglePart = \(id: string\) => \{/g;
const matches = code.match(regex);
console.log("Found matches: ", matches ? matches.length : 0);
