const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /className=\{`text-\[13px\] font-bold font-mono truncate \$\{isSelected \? 'text-text-main' : 'text-text-dim'\}`\}/g,
  "className={`text-[13px] font-bold font-mono truncate text-text-main`}"
);
code = code.replace(
  /<span className="text-\[11px\] font-mono text-text-dim truncate mt-0\.5">/g,
  '<span className={`text-[11px] font-mono truncate mt-0.5 ${isSelected ? "text-text-dim" : "text-text-main opacity-80"}`}>'
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn text colors");
