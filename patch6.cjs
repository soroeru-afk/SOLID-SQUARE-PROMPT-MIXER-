const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldUnique = `  const uniqueCategories = useMemo(() => {
    const cats = new Map<string, number>(); // category -> section
    data.parts.forEach(p => cats.set(p.category, p.section));
    return Array.from(cats.entries());
  }, [data.parts]);`;

const newUnique = `  const uniqueCategories = useMemo(() => {
    const cats = new Map<string, number>(); // category -> section
    data.parts.forEach(p => cats.set(p.category, p.section));
    if (data.customCategories) {
      data.customCategories.forEach(c => cats.set(c.name, c.section));
    }
    return Array.from(cats.entries());
  }, [data.parts, data.customCategories]);`;

code = code.replace(oldUnique, newUnique);

fs.writeFileSync('src/App.tsx', code);
