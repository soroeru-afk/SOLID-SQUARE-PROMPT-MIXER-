const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const stateStr = `  const [draggedCategory, setDraggedCategory] = useState<{ name: string, section: number } | null>(null);`;
code = code.replace(/  const \[draggedPart, setDraggedPart\] = useState[^\n]+;\n/, match => match + stateStr + '\n');

const handlerStr = `
  const handleCatDragStart = (e: React.DragEvent, name: string, section: number) => {
    setDraggedCategory({ name, section });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };
  const handleCatDragEnd = (e: React.DragEvent) => {
    setDraggedCategory(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };
  const handleCatDragOver = (e: React.DragEvent, section: number) => {
    e.preventDefault();
    if (draggedCategory?.section === section) {
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };
  const handleCatDrop = (e: React.DragEvent, targetName: string, section: number) => {
    e.preventDefault();
    if (!draggedCategory || draggedCategory.section !== section || draggedCategory.name === targetName) return;
    if (onReorderCategory) {
      onReorderCategory(section, draggedCategory.name, targetName);
    }
  };
`;

code = code.replace(/  const handleDragStart = [^\n]+ {\n/, match => handlerStr + match);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
