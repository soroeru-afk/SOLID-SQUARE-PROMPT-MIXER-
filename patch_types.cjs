const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/content: string;\n\s*mark\?: string;/, 'content: string;\n  negativeContent?: string;\n  mark?: string;');

fs.writeFileSync('src/types.ts', code);
