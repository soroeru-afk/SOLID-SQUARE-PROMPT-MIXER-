const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ History State for Undo\/Redo/;
code = code.replace(regex, `// History State for Undo/Redo
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);`);

fs.writeFileSync('src/App.tsx', code);
