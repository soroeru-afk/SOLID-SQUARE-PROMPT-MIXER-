const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /setExportDirectoryName\(handle\.name\);\n\s*\}/g;
let replaced = false;
code = code.replace(regex, (match) => {
  if (!replaced) {
    replaced = true;
    return `setExportDirectoryName(handle.name);\n          await loadLatestFileFromDir(handle);\n        }`;
  }
  return match;
});

fs.writeFileSync('src/App.tsx', code);
