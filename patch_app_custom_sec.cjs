const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /const handleReorderCategory = \(section: number, draggedCat: string, targetCat: string\) => \{/;
const newHandlers = `const handleRenameSection = (section: number, newName: string) => {
    setData(prev => ({
      ...prev,
      customSectionNames: {
        ...(prev.customSectionNames || {}),
        [section]: newName
      }
    }));
  };

  const handleReorderCategory = (section: number, draggedCat: string, targetCat: string) => {`;
code = code.replace(regex1, newHandlers);

const regex2 = /customCategories=\{data\.customCategories\}/g;
code = code.replace(regex2, "customCategories={data.customCategories}\n              customSectionNames={data.customSectionNames}\n              onRenameSection={handleRenameSection}");

fs.writeFileSync('src/App.tsx', code);
