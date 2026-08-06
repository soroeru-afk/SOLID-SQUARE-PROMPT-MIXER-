const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');
content = content.replace(/const \[catId, idxStr\] = id\.split\(':'\);/g, "const [catId, idxStr] = (id as string).split(':');");
fs.writeFileSync('src/components/AttributeMixer.tsx', content);

let modalContent = fs.readFileSync('src/components/SaveMasterModal.tsx', 'utf8');
modalContent = modalContent.replace(/\{t\('copy', lang\)\}/g, "コピー (Copy)");
fs.writeFileSync('src/components/SaveMasterModal.tsx', modalContent);
console.log('patched ts errors');
