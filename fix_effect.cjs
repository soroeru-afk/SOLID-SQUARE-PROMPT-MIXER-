const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/getFileHandle\('export_directory'\)\.then\(handle => \{/, "getFileHandle('export_directory').then(async handle => {");

// Wait, the previous replacement also replaced the end of the condition wrongly?
// Let's replace the whole useEffect.
const brokenEffect = /useEffect\(\(\) => \{\n\s*getFileHandle\('export_directory'\)\.then\(.*?\n.*?\n.*?\n.*?\n.*?\n.*?\}, \[\]\);/s;

const fixedEffect = `useEffect(() => {
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

code = code.replace(brokenEffect, fixedEffect);
fs.writeFileSync('src/App.tsx', code);
