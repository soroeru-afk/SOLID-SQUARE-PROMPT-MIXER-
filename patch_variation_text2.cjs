const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /<span className=\{`text-\[11px\] font-mono truncate mt-0\.5 \$\{isSelected \? "text-text-dim" : "text-text-main opacity-80"\}`\}>/g,
  '<span className="text-[11px] font-mono truncate mt-0.5 text-text-main opacity-70">'
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn text colors again");
