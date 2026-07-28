const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(/  const handleDragStart = \(e: React.DragEvent, id: string, category: string\) => {\n/g, '  const handleDragStart = (e: React.DragEvent, id: string, category: string) => {\n    e.stopPropagation();\n');
code = code.replace(/  const handleDragEnd = \(e: React.DragEvent\) => {\n/g, '  const handleDragEnd = (e: React.DragEvent) => {\n    e.stopPropagation();\n');
code = code.replace(/  const handleDragOver = \(e: React.DragEvent, category: string\) => {\n/g, '  const handleDragOver = (e: React.DragEvent, category: string) => {\n    e.stopPropagation();\n');
code = code.replace(/  const handleDrop = \(e: React.DragEvent, id: string, category: string\) => {\n/g, '  const handleDrop = (e: React.DragEvent, id: string, category: string) => {\n    e.stopPropagation();\n');

fs.writeFileSync('src/components/VariationColumn.tsx', code);
