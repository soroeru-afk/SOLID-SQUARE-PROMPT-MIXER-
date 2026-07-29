const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /onConfirm=\{\(title, content, isNegative, items\) => \{\n\s*if \(items && items\.length > 0\) \{\n\s*items\.forEach\(item => \{\n\s*handleSaveAsMaster\(item\.name, item\.content, isNegative\);\n\s*\}\);\n\s*\} else \{\n\s*handleSaveAsMaster\(title, content, isNegative\);\n\s*\}/;

const replace = `onConfirm={(title, content, isNegative, items, negativeContent) => {
            if (items && items.length > 0) {
              items.forEach(item => {
                handleSaveAsMaster(item.name, item.content, isNegative);
              });
            } else {
              handleSaveAsMaster(title, content, isNegative, negativeContent);
            }`;

code = code.replace(regex, replace);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx save master from part");
