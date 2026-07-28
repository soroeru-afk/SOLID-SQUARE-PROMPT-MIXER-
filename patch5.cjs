const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const replacementOver = `  const handleDragOver = (e: React.DragEvent, category: string) => {
    if (draggedCategory) return; // Let it bubble to category handler
    e.stopPropagation();
`;

code = code.replace(/  const handleDragOver = \(e: React.DragEvent, category: string\) => {\n    e.stopPropagation();\n/g, replacementOver);

const replacementDrop = `  const handleDrop = (e: React.DragEvent, id: string, category: string) => {
    if (draggedCategory) return; // Let it bubble to category handler
    e.stopPropagation();
`;

code = code.replace(/  const handleDrop = \(e: React.DragEvent, id: string, category: string\) => {\n    e.stopPropagation();\n/g, replacementDrop);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
