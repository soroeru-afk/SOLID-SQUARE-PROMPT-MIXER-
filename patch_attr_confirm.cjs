const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const stateRegex = /const \[negativePrompt, setNegativePrompt\] = useState\(''\);/m;
const newState = `const [negativePrompt, setNegativePrompt] = useState('');
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);
  const [confirmDeleteCombId, setConfirmDeleteCombId] = useState<string | null>(null);`;
content = content.replace(stateRegex, newState);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
