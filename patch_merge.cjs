const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const processMergeRegex = /const processMerge = \(text: string\) => \{[\s\S]*?return cleanString\(result\.join\(', '\)\);\s*\};/;

const newProcessMerge = `const processMerge = (text: string) => {
      const parts = text.split(',').map(s => s.trim()).filter(Boolean);
      const counts = new Map<string, number>();
      
      parts.forEach(part => {
        let cleanPart = part;
        let weight = 1;
        const match = part.match(/^\\((.+?)[: ]x?([0-9.]+)\\)$/);
        if (match) {
          cleanPart = match[1].trim();
          weight = parseFloat(match[2]);
        } else if (part.startsWith('(') && part.endsWith(')')) {
          // If it's just (word), weight is 1.1 in some standard UI, but let's stick to 1 to match existing or keep 1.1?
          // Existing code sets weight to 1 if not matched by regex.
        }
        counts.set(cleanPart, (counts.get(cleanPart) || 0) + weight);
      });
      
      let maxWeight = 0;
      for (const count of counts.values()) {
        if (count > maxWeight) maxWeight = count;
      }
      
      const scaleFactor = maxWeight > 1.4 ? maxWeight / 1.4 : 1;
      
      const result = [];
      for (const [part, count] of counts.entries()) {
        let newWeight = count / scaleFactor;
        
        // Lower limit guard
        if (newWeight < 0.1 && count > 0) {
          newWeight = 0.1;
        }
        
        const finalCount = Math.round(newWeight * 100) / 100;
        
        if (finalCount === 1) {
          result.push(part);
        } else {
          result.push(\`(\${part}:\${finalCount})\`);
        }
      }
      return cleanString(result.join(', '));
    };`;

code = code.replace(processMergeRegex, newProcessMerge);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Updated handleMergeDupes");
