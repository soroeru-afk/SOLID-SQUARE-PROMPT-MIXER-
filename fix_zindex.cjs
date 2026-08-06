const fs = require('fs');

const files = [
  'src/components/ConfirmModal.tsx',
  'src/components/AddModal.tsx',
  'src/components/SavePartModal.tsx',
  'src/components/SaveMasterModal.tsx',
  'src/components/SaveMemoModal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/z-50/g, 'z-[9999]');
    fs.writeFileSync(file, content);
    console.log('Fixed z-index in', file);
  }
});
