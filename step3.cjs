const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const elseBlockStart = `    } else {
      categories.forEach(cat => {
        const selectedIdx = selections[cat.id] ?? 0;
        if (selectedIdx === 0) return;

        const items = presets[cat.id] || DEFAULT_PRESETS[cat.id] || [];
        const selectedItem = items[selectedIdx];
        if (!selectedItem || selectedItem.value.trim() === '') return;

        newParts.push({`;

const elseBlockReplacement = `    } else {
      categories.forEach(cat => {
        const selection = selections[cat.id];
        const currentIndices = Array.isArray(selection) ? selection : (selection !== undefined ? [selection as number] : [0]);
        currentIndices.forEach(idx => {
          if (idx === 0) return;

          const items = presets[cat.id] || DEFAULT_PRESETS[cat.id] || [];
          const selectedItem = items[idx];
          if (!selectedItem || selectedItem.value.trim() === '') return;

          newParts.push({`;

content = content.replace(elseBlockStart, elseBlockReplacement);

const closeBlockStart = `          isNegative: cat.isNegative
        });
      });
    }`;

const closeBlockReplacement = `          isNegative: cat.isNegative
          });
        });
      });
    }`;
content = content.replace(closeBlockStart, closeBlockReplacement);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
