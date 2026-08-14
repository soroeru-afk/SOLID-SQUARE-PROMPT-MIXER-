const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The button has this exact text: {lang === 'en' ? 'Export (Parts)' : 'エクスポート (パーツ)'}
// Let's replace the whole button string via regex
const regex = /<button onClick=\{handleExportParts\}[^>]*>[\s\S]*?<\/button>/;
const match = code.match(regex);
if (match) {
  let btnCode = match[0];
  btnCode = btnCode.replace(
    /\$\{theme === 'mono' \? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-accent-main border-accent-dim hover:opacity-80'\}/,
    "${theme === 'mono' ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : (theme === 'black' ? 'bg-accent-main border-accent-dim hover:opacity-80' : 'bg-teal-600 border-teal-500 hover:opacity-80')}"
  );
  code = code.replace(regex, btnCode);
  console.log("Button patched via regex.");
}

fs.writeFileSync('src/App.tsx', code);
