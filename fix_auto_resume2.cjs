const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /getFileHandle\('export_directory'\)\.then\(async handle => \{[\s\S]*?console\.error\('Error auto-resuming on load', e\);\n\s*\}\n\s*\}\n\s*\}\);/;

const replacement = `getFileHandle('export_directory').then(async handle => {
      if (handle && handle.name) {
        setExportDirectoryName(handle.name);
      }
    });`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('auto-resume on load patched');
} else {
  console.log('auto-resume regex not found');
}
