const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const handleSelectMemoId = \(id: string \| null, insert\?: boolean\) => \{/, "const handleSelectMemoId = (id: string | null, insert: boolean = true) => {");

fs.writeFileSync('src/App.tsx', code);
