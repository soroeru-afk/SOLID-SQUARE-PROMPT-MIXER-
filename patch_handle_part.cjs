const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /onSaveAsPart=\{\(name, content, category, section, items\) => \{\n\s*if \(items && items\.length > 0\) \{\n\s*setData\(prev => \{\n\s*const newParts: VariationPart\[\] = items\.map\(\(item, i\) => \(\{\n\s*id: `p_\$\{Date\.now\(\)\}_\$\{i\}_\$\{Math\.random\(\)\.toString\(36\)\.substr\(2, 9\)\}`,\n\s*name: item\.name,\n\s*content: item\.content,\n\s*category,\n\s*section: section as 1 \| 2 \| 3 \| 4,\n\s*isPinned: false\n\s*\}\)\);\n\s*return \{ \.\.\.prev, parts: \[\.\.\.newParts, \.\.\.prev\.parts\] \};\n\s*\}\);\n\s*\} else \{\n\s*handleAddPart\(category, section, name, content\);\n\s*\}\n\s*\}\}/;

const replace = `onSaveAsPart={(name, content, category, section, items, isUpdate) => {
              if (items && items.length > 0) {
                setData(prev => {
                  const newParts: VariationPart[] = items.map((item, i) => ({
                    id: \`p_\${Date.now()}_\${i}_\${Math.random().toString(36).substr(2, 9)}\`,
                    name: item.name,
                    content: item.content,
                    category,
                    section: section as 1 | 2 | 3 | 4,
                    isPinned: false
                  }));
                  return { ...prev, parts: [...newParts, ...prev.parts] };
                });
              } else {
                const selectedPartId = selectedPartIds.size === 1 ? Array.from(selectedPartIds)[0] : null;
                if (isUpdate && selectedPartId) {
                  handleUpdatePart(selectedPartId, { name, content, category, section: section as 1|2|3|4 });
                } else {
                  handleAddPart(category, section, name, content);
                }
              }
            }}`;

code = code.replace(regex, replace);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched handleSaveAsPart");
