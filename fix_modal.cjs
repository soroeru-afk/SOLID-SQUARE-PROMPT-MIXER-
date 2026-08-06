const fs = require('fs');
let content = fs.readFileSync('src/components/ConfirmModal.tsx', 'utf8');

if (!content.includes('createPortal')) {
  content = content.replace(
    /import React from 'react';/,
    "import React from 'react';\nimport { createPortal } from 'react-dom';"
  );

  content = content.replace(
    /return \(\s*<AnimatePresence>/,
    `const modalContent = (
    <AnimatePresence>
`
  );

  content = content.replace(
    /<\/AnimatePresence>\s*\);\s*\};/,
    `    </AnimatePresence>\n  );\n\n  return createPortal(modalContent, document.body);\n};`
  );
  
  fs.writeFileSync('src/components/ConfirmModal.tsx', content);
  console.log('Fixed ConfirmModal with createPortal');
}
