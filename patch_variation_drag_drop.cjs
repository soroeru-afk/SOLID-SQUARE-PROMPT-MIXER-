const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// 1. Add draggedSection state
const draggedSectionRegex = /const \[draggedCategory, setDraggedCategory\] = useState<\{[^\}]+\} \| null>\(null\);/;
code = code.replace(draggedSectionRegex, `const [draggedCategory, setDraggedCategory] = useState<{ name: string, section: number } | null>(null);
  const [draggedSection, setDraggedSection] = useState<number | null>(null);`);

// 2. Add section drag and drop handlers
const handlersRegex = /const handleCatDragStart = \(e: React\.DragEvent, name: string, section: number\) => \{/;
code = code.replace(handlersRegex, `const handleSectionDragStart = (e: React.DragEvent, sectionId: number) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };
  const handleSectionDragEnd = (e: React.DragEvent) => {
    setDraggedSection(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };
  const handleSectionDragOver = (e: React.DragEvent, targetSectionId: number) => {
    e.preventDefault();
    if (draggedSection !== null && draggedSection !== targetSectionId) {
      setSectionOrder(prev => {
        const fromIdx = prev.indexOf(draggedSection);
        const toIdx = prev.indexOf(targetSectionId);
        if (fromIdx < 0 || toIdx < 0) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        localStorage.setItem('variation_section_order', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleCatDragStart = (e: React.DragEvent, name: string, section: number) => {`);

// 3. Attach drag events to the section div
const sectionDivRegex = /<div key=\{secId\} className="space-y-4">/;
code = code.replace(sectionDivRegex, `<div 
                key={secId} 
                className="space-y-4"
                draggable={editingId === null && editingCategory === null}
                onDragStart={(e) => handleSectionDragStart(e, Number(secId))}
                onDragEnd={handleSectionDragEnd}
                onDragOver={(e) => handleSectionDragOver(e, Number(secId))}
              >`);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
