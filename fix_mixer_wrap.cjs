const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(
  /<div className="shrink-0 flex pt-1 pb-2">\s*<AttributeMixer onApply=\{onMixAttributes \|\| \(\(\) => \{\}\)\} \/>\s*<\/div>/,
  '<div className="shrink-0 flex pt-2 pb-1 w-full">\n            <AttributeMixer onApply={onMixAttributes || (() => {})} />\n          </div>'
);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Updated VariationColumn mixer wrapper");
