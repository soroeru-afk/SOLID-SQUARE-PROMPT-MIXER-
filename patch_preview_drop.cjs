const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const dropFunctions = `
  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const handleDropFile = (e: React.DragEvent<HTMLTextAreaElement>, isNegative: boolean) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
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
`;

code = code.replace(/const handleMoveSelection =/, dropFunctions + "\n  const handleMoveSelection =");

code = code.replace(/<textarea\n\s*ref=\{positiveTextRef\}\n\s*value=\{editorText\}/, "<textarea\n              ref={positiveTextRef}\n              value={editorText}\n              onDragOver={handleDragOver}\n              onDrop={(e) => handleDropFile(e, false)}");

code = code.replace(/<textarea\n\s*ref=\{negativeTextRef\}\n\s*value=\{negativeEditorText\}/, "<textarea\n              ref={negativeTextRef}\n              value={negativeEditorText}\n              onDragOver={handleDragOver}\n              onDrop={(e) => handleDropFile(e, true)}");

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
