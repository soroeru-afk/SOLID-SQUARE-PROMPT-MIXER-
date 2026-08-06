const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const regex = /const \[combinations, setCombinations\] = useState<Combination\[\]>\(\(\) => \{[\s\S]*?return finalCombos;\n\s*\}\);/;
if (content.match(regex)) {
  content = content.replace(regex, 'const [combinations, setCombinations] = useState<Combination[]>([]);');
  fs.writeFileSync('src/components/AttributeMixer.tsx', content);
  console.log('combinations patched');
} else {
  console.log('combinations regex not found');
}
