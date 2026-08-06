const fs = require('fs');
let content = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

content = content.replace(
  'const [sectionOrder, setSectionOrder] = useState<number[]>([1, 2, 3, 4]);',
  `const [sectionOrder, setSectionOrder] = useState<number[]>(() => {
    const saved = localStorage.getItem('variation_section_order');
    return saved ? JSON.parse(saved) : [1, 2, 3, 4];
  });`
);

fs.writeFileSync('src/components/VariationColumn.tsx', content);
