const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regex = /onConfirm=\{\(title, content, isNegative, items\) => \{\n\s*if \(onSaveAsMaster\) \{\n\s*if \(items && items\.length > 0\) \{\n\s*items\.forEach\(item => \{\n\s*onSaveAsMaster\(item\.name, item\.content, isNegative\);\n\s*\}\);\n\s*\} else \{\n\s*onSaveAsMaster\(title, content, isNegative\);\n\s*\}\n\s*\}/;

const replace = `onConfirm={(title, content, isNegative, items, negativeContent) => {
          if (onSaveAsMaster) {
            if (items && items.length > 0) {
              items.forEach(item => {
                onSaveAsMaster(item.name, item.content, isNegative);
              });
            } else {
              onSaveAsMaster(title, content, isNegative, negativeContent);
            }
          }`;

code = code.replace(regex, replace);
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn onConfirm");
