const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const oldUnique = `  const uniqueCategories = useMemo(() => {
    const cats = new Map<string, number>(); // category -> section
    parts.forEach(p => cats.set(p.category, p.section));
    return Array.from(cats.entries());
  }, [parts]);`;

const newUnique = `  const uniqueCategories = useMemo(() => {
    const cats = new Map<string, number>(); // category -> section
    parts.forEach(p => cats.set(p.category, p.section));
    if (customCategories) {
      customCategories.forEach(c => cats.set(c.name, c.section));
    }
    return Array.from(cats.entries());
  }, [parts, customCategories]);`;

code = code.replace(oldUnique, newUnique);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
