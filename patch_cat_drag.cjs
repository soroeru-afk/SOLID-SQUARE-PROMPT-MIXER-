const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /const handleCatDragStart = \(e: React.DragEvent, name: string, section: number\) => \{/g,
  `const handleCatDragStart = (e: React.DragEvent, name: string, section: number) => {
    e.stopPropagation();`
);

code = code.replace(
  /const handleCatDragEnd = \(e: React.DragEvent\) => \{/g,
  `const handleCatDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();`
);

code = code.replace(
  /const handleCatDragOver = \(e: React.DragEvent, section: number\) => \{/g,
  `const handleCatDragOver = (e: React.DragEvent, section: number) => {
    e.stopPropagation();`
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
