const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);",
  "const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);\n  const [loadSuccessMessage, setLoadSuccessMessage] = useState<string | null>(null);"
);

code = code.replace("setSaveSuccessMessage(`Resumed from ${latestFile.name}`);", "setLoadSuccessMessage(`Resumed from ${latestFile.name}`);");
code = code.replace("setTimeout(() => setSaveSuccessMessage(null), 3000);", "setTimeout(() => setLoadSuccessMessage(null), 3000);");
code = code.replace("setSaveSuccessMessage('No JSON files found in directory');", "setLoadSuccessMessage('No JSON files found in directory');");
code = code.replace("setTimeout(() => setSaveSuccessMessage(null), 3000);", "setTimeout(() => setLoadSuccessMessage(null), 3000);");

code = code.replace(
  /\{saveSuccessMessage && \(\n\s*<div className="mt-1 text-center text-\[10px\] font-mono text-accent-main animate-pulse font-bold">\n\s*\{saveSuccessMessage\}\n\s*<\/div>\n\s*\)\}/,
  "{loadSuccessMessage && (<div className=\"mt-1 text-center text-[10px] font-mono text-accent-main animate-pulse font-bold\">{loadSuccessMessage}</div>)}"
);

code = code.replace(
  "</footer>",
  "</footer>\n      {saveSuccessMessage && (\n        <div className=\"fixed bottom-10 right-10 bg-accent-main text-white px-4 py-2 rounded shadow-lg text-sm font-bold font-mono z-50 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-4 duration-300\">\n          <Check className=\"w-4 h-4\" />\n          <span>{saveSuccessMessage}</span>\n        </div>\n      )}"
);

fs.writeFileSync('src/App.tsx', code);
