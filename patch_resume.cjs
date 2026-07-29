const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const loadLatestFileStr = `
  const loadLatestFileFromDir = async (dirHandle: any) => {
    try {
      let latestFile = null;
      let latestTime = 0;
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          const file = await entry.getFile();
          if (file.lastModified > latestTime) {
            latestTime = file.lastModified;
            latestFile = file;
          }
        }
      }
      if (latestFile) {
        const text = await latestFile.text();
        const parsed = JSON.parse(text);
        if (parsed.masters && parsed.parts) {
          setData(parsed);
          setSelectedMasterId(parsed.masters[0]?.id || null);
          setSaveSuccessMessage(\`Resumed from \${latestFile.name}\`);
          setTimeout(() => setSaveSuccessMessage(null), 3000);
        }
      } else {
        setSaveSuccessMessage('No JSON files found in directory');
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      }
    } catch (e) {
      console.error("Failed to load latest file", e);
    }
  };

  const handleResumeFromDir = async () => {
    if ('showDirectoryPicker' in window && window.self === window.top) {
      try {
        let dirHandle = await getFileHandle('export_directory');
        if (dirHandle) {
          const permission = await dirHandle.queryPermission({ mode: 'read' });
          if (permission !== 'granted') {
            const req = await dirHandle.requestPermission({ mode: 'read' });
            if (req !== 'granted') return;
          }
          await loadLatestFileFromDir(dirHandle);
        }
      } catch (err) {
        console.error('Resume API Error:', err);
      }
    }
  };
`;

code = code.replace(/const handleChangeExportDir = async \(\) => \{/, loadLatestFileStr + "\n  const handleChangeExportDir = async () => {");

code = code.replace(/setExportDirectoryName\(handle\.name\);\n\s*\}/, "setExportDirectoryName(handle.name);\n          await loadLatestFileFromDir(handle);\n        }");

const buttonsRegex = /\{exportDirectoryName && \(\n\s*<button onClick=\{handleClearExportDir\} className="text-\[10px\] font-mono text-text-main font-bold hover:text-accent-main transition-colors">\(CLEAR\)<\/button>\n\s*\)\}/;
const newButtons = `{exportDirectoryName && (
                    <>
                      <button onClick={handleResumeFromDir} className="text-[10px] font-mono text-text-main font-bold hover:text-accent-main transition-colors">(RESUME)</button>
                      <button onClick={handleClearExportDir} className="text-[10px] font-mono text-text-main font-bold hover:text-accent-main transition-colors">(CLEAR)</button>
                    </>
                  )}`;

code = code.replace(buttonsRegex, newButtons);

fs.writeFileSync('src/App.tsx', code);
