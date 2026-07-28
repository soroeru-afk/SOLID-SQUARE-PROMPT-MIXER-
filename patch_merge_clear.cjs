const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexMergeDupes = /  const handleMergeDupes = \(\) => \{[\s\S]*?  \};\n/m;

const newFunctions = `  const handleMergeDupes = () => {
    const processMerge = (text: string) => {
      const parts = text.split(',').map(s => s.trim()).filter(Boolean);
      const counts = new Map<string, number>();
      
      parts.forEach(part => {
        let cleanPart = part;
        let weight = 1;
        const match = part.match(/^\\((.+?)[: ]x?([0-9.]+)\\)$/);
        if (match) {
          cleanPart = match[1].trim();
          weight = parseFloat(match[2]);
        }
        counts.set(cleanPart, (counts.get(cleanPart) || 0) + weight);
      });
      
      const result = [];
      for (const [part, count] of counts.entries()) {
        if (count !== 1) {
          const finalCount = Math.round(count * 100) / 100;
          result.push(\`(\${part}:\${finalCount})\`);
        } else {
          result.push(part);
        }
      }
      return cleanString(result.join(', '));
    };

    if (activeMasterTab === 'master') {
      setEditorText(prev => processMerge(prev));
    } else if (activeMasterTab === 'negative') {
      setNegativeEditorText(prev => processMerge(prev));
    }
  };

  const handleClearAllWeights = () => {
    const processClear = (text: string) => {
      return text.split(',').map(part => {
        const trimmed = part.trim();
        const clean = trimmed.replace(/[\\(\\)\\[\\]]/g, '').replace(/:\\s*[0-9.]+/g, '');
        return clean;
      }).filter(Boolean).join(', ');
    };

    if (activeMasterTab === 'master') {
      setEditorText(prev => processClear(prev));
    } else if (activeMasterTab === 'negative') {
      setNegativeEditorText(prev => processClear(prev));
    }
  };
`;

code = code.replace(regexMergeDupes, newFunctions);
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
