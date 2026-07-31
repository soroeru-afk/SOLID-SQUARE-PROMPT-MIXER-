const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Add import
const importStatement = "import { extractMetadataFromImage } from '../utils/imageMetadata';\n";
code = code.replace("import { SaveMemoModal } from './SaveMemoModal';", "import { SaveMemoModal } from './SaveMemoModal';\n" + importStatement);

// Update handleDropFile
const dropFileRegex = /const handleDropFile = \([\s\S]*?\}\s*\}\s*\};\s*const handleMoveSelection/m;

const newDropFile = `const handleDropFile = async (e: React.DragEvent<HTMLTextAreaElement>, isNegative: boolean) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image/')) {
        const metadata = await extractMetadataFromImage(file);
        if (metadata) {
          if (metadata.positive) {
            setEditorText(prev => prev ? prev + '\\n' + metadata.positive : metadata.positive);
          }
          if (metadata.negative) {
            setNegativeEditorText(prev => prev ? prev + '\\n' + metadata.negative : metadata.negative);
          }
          if (metadata.settings && !isNegative) {
            // Optional: append settings somewhere, or just to positive
            setEditorText(prev => prev + '\\n/* Settings: ' + metadata.settings + ' */');
          }
        }
      } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            if (isNegative) {
              setNegativeEditorText(prev => prev ? prev + '\\n' + content : content);
            } else {
              setEditorText(prev => prev ? prev + '\\n' + content : content);
            }
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleMoveSelection`;

code = code.replace(dropFileRegex, newDropFile);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Updated handleDropFile");
