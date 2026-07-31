const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

code = code.replace(/text-\[12px\]/g, 'text-13px-tmp');
code = code.replace(/text-\[11px\]/g, 'text-[12.5px]');
code = code.replace(/text-13px-tmp/g, 'text-[14px]');

// Change width
code = code.replace(/w-80/, 'w-[400px]');

// Change btnClass
code = code.replace(
  /const btnClass = isMono\s*\n\s*\? 'bg-bg-input hover:bg-text-main text-text-main hover:text-bg-base border border-border-main'\s*\n\s*: 'bg-blue-600 hover:bg-blue-500 text-white';/,
  `const btnClass = isMono 
    ? 'bg-gray-900 hover:bg-black text-white border border-gray-700' 
    : 'bg-blue-600 hover:bg-blue-500 text-white';`
);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
console.log("Updated styles");
