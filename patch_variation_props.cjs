const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const regexProps = /customCategories\?: \{ name: string, section: number \}\[\];/;
code = code.replace(regexProps, "customCategories?: { name: string, section: number }[];\n  customSectionNames?: Record<number, string>;\n  onRenameSection?: (section: number, newName: string) => void;");

const regexDestruct = /customCategories = \[\],/;
code = code.replace(regexDestruct, "customCategories = [], customSectionNames = {}, onRenameSection,");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
