const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const deleteCombinationRegex = /const deleteCombination = \(id: string\) => \{\n\s*if \(confirm\('この設定を削除しますか？'\)\) \{\n\s*setCombinations\(prev => prev\.filter\(c => c\.id !== id\)\);\n\s*if \(activeCombinationId === id\) setActiveCombinationId\(''\);\n\s*\}\n\s*\};/m;

const newDeleteCombination = `const deleteCombination = (id: string) => {
    setCombinations(prev => prev.filter(c => c.id !== id));
    if (activeCombinationId === id) setActiveCombinationId('');
  };`;
content = content.replace(deleteCombinationRegex, newDeleteCombination);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
