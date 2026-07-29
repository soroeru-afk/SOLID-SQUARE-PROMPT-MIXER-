const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffect = /useEffect\(\(\) => \{\n\s*getFileHandle\('export_directory'\)\.then\(handle => \{\n\s*if \(handle && handle\.name\) \{\n\s*setExportDirectoryName\(handle\.name\);\n\s*\}\n\s*\}\);\n\s*\}, \[\]\);/;

const newEffect = `useEffect(() => {
    getFileHandle('export_directory').then(async handle => {
      if (handle && handle.name) {
        setExportDirectoryName(handle.name);
        try {
          if ('queryPermission' in handle) {
            const permission = await handle.queryPermission({ mode: 'read' });
            if (permission === 'granted') {
              await loadLatestFileFromDir(handle);
            }
          }
        } catch (e) {
          console.error('Error auto-resuming on load', e);
        }
      }
    });
  }, []);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/App.tsx', code);
