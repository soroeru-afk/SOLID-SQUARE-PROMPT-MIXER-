const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert onReorderCategory
const handleReorderCategoryStr = `
  const handleReorderCategory = (section: number, draggedCat: string, targetCat: string) => {
    setData(prev => {
      let currentOrder = prev.customCategories ? prev.customCategories.filter(c => c.section === section).map(c => c.name) : [];
      
      // Add any default categories that are not in customCategories
      const existingCats = Array.from(new Set(prev.parts.filter(p => p.section === section).map(p => p.category)));
      for (const cat of existingCats) {
        if (!currentOrder.includes(cat)) currentOrder.push(cat);
      }
      
      const draggedIdx = currentOrder.indexOf(draggedCat);
      const targetIdx = currentOrder.indexOf(targetCat);
      
      if (draggedIdx !== -1 && targetIdx !== -1) {
        currentOrder.splice(draggedIdx, 1);
        currentOrder.splice(targetIdx, 0, draggedCat);
      }
      
      const otherSections = (prev.customCategories || []).filter(c => c.section !== section);
      const newCustomCategories = [
        ...otherSections,
        ...currentOrder.map(name => ({ name, section: section as 1 | 2 | 3 | 4 }))
      ];
      
      return { ...prev, customCategories: newCustomCategories };
    });
  };
`;

code = code.replace(/const handleDeleteCategory = [^{]+{[^}]+};\n  };\n/m, match => match + handleReorderCategoryStr);
code = code.replace(/onDeleteCategory={handleDeleteCategory}/g, 'onDeleteCategory={handleDeleteCategory}\n              onReorderCategory={handleReorderCategory}');

fs.writeFileSync('src/App.tsx', code);
