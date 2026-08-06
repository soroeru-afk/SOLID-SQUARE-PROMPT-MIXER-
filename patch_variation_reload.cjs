const fs = require('fs');
let content = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const regex = /const \[sectionOrder, setSectionOrder\] = useState<number\[\]>\(\(\) => \{\n\s*const saved = localStorage\.getItem\('variation_section_order'\);\n\s*return saved \? JSON\.parse\(saved\) : \[1, 2, 3, 4\];\n\s*\}\);/;

if (content.match(regex)) {
  const replacement = `const [sectionOrder, setSectionOrder] = useState<number[]>(() => {
    const saved = localStorage.getItem('variation_section_order');
    return saved ? JSON.parse(saved) : [1, 2, 3, 4];
  });
  
  useEffect(() => {
    const handleImport = () => {
      const saved = localStorage.getItem('variation_section_order');
      if (saved) {
        try { setSectionOrder(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('attributeMixerDataImported', handleImport);
    return () => window.removeEventListener('attributeMixerDataImported', handleImport);
  }, []);`;
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/VariationColumn.tsx', content);
  console.log('Patched VariationColumn');
} else {
  console.log('Not found');
}
