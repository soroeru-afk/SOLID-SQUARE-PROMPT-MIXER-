const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

code = code.replace(/onSaveAsMaster\?: \(title: string, content: string, isNegative: boolean\) => void;\n\s*onSaveAsPart\?: \(name: string, content: string, category: string, section: number, items\?: \{name: string, content: string\}\[\]\) => void;/,
  "onSaveAsMaster?: (title: string, content: string, isNegative: boolean, negativeContent?: string, isUpdate?: boolean) => void;\n  onSaveAsPart?: (name: string, content: string, category: string, section: number, items?: {name: string, content: string}[], isUpdate?: boolean) => void;");

code = code.replace(/selectedMemoName\?: string;\n\s*uniqueCategories\?: \[string, number\]\[\];/,
  "selectedMemoName?: string;\n  selectedMasterId?: string | null;\n  selectedMasterName?: string;\n  selectedNegativeId?: string | null;\n  selectedNegativeName?: string;\n  selectedPartId?: string | null;\n  selectedPartName?: string;\n  uniqueCategories?: [string, number][];");

code = code.replace(/export const PreviewColumn: React\.FC<PreviewColumnProps> = \(\{([\s\S]*?)\} \) => \{/,
  "export const PreviewColumn: React.FC<PreviewColumnProps> = ({$1,\n  selectedMasterId,\n  selectedMasterName,\n  selectedNegativeId,\n  selectedNegativeName,\n  selectedPartId,\n  selectedPartName\n}) => {");

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn props");
