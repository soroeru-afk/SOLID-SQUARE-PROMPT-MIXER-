const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(/\{onMixAttributes && \(\s*<div className="shrink-0 flex pt-1">\s*<AttributeMixer onApply=\{onMixAttributes\} \/>\s*<\/div>\s*\)\}/m, 
`<div className="shrink-0 flex pt-1 pb-2">
            <AttributeMixer onApply={onMixAttributes || (() => {})} />
          </div>`);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Updated VariationColumn to remove conditional onMixAttributes");
