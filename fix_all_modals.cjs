const fs = require('fs');

function fixModal(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('createPortal')) {
    content = content.replace(
      /import React([^;]*);/,
      "import React$1;\nimport { createPortal } from 'react-dom';"
    );
    
    content = content.replace(
      /return \(\s*<AnimatePresence>/,
      `const modalContent = (\n    <AnimatePresence>`
    );
    
    content = content.replace(
      /<\/AnimatePresence>\s*\);\s*\};/,
      `    </AnimatePresence>\n  );\n\n  return createPortal(modalContent, document.body);\n};`
    );
    
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}

['src/components/AddModal.tsx', 'src/components/SaveMemoModal.tsx', 'src/components/SavePartModal.tsx', 'src/components/SaveMasterModal.tsx'].forEach(fixModal);
