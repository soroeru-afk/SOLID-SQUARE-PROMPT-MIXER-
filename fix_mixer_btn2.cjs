const fs = require('fs');
let code = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

code = code.replace(
  /<div className="relative" ref=\{containerRef\}>/,
  '<div className="relative w-full" ref={containerRef}>'
);

fs.writeFileSync('src/components/AttributeMixer.tsx', code);
console.log("Updated AttributeMixer parent div");
