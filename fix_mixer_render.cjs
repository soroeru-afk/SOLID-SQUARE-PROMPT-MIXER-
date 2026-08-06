const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

content = content.replace(
  /const items = presets\[key\] \|\| DEFAULT_PRESETS\[key\] \|\| \[\{ label: '指定なし \/ None', value: '' \}\];/g,
  "const items = Array.isArray(presets[key]) ? presets[key] : (DEFAULT_PRESETS[key] || [{ label: '指定なし / None', value: '' }]);"
);

content = content.replace(
  /\{items\.map\(\(item, idx\) => idx === 0 && items\.length > 1 \? null : \(/g,
  "{items.map((item, idx) => (!item || (idx === 0 && items.length > 1)) ? null : ("
);

content = content.replace(
  /value=\{item\.label\}/g,
  "value={item?.label || ''}"
);

content = content.replace(
  /value=\{item\.value\}/g,
  "value={item?.value || ''}"
);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('patched render safeguards');
