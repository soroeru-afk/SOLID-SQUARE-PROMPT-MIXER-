const fs = require('fs');

const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

const newCode = [];
let i = 0;
while (i < lines.length) {
    if (lines[i].includes('const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {')) {
        break;
    }
    newCode.push(lines[i]);
    i++;
}

newCode.push(`  const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    };

    setEditorText(prev => {
      let result = prev;
      
      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
        result = result.replace(targetRegex, posStr);
      } else {
        for (const known of ALL_KNOWN_POS_STRINGS) {
          if (!known) continue;
          result = result.replace(known, '');
          const coreKnown = known.replace(/,\\s*$/, '');
          result = result.replace(coreKnown, '');
        }
        
        if (posStr) {
          result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + result;
        }
      }
      
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });

    setNegativeEditorText(prev => {
      let result = prev;
      
      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
        result = result.replace(targetRegex, negStr);
      } else {
        for (const known of ALL_KNOWN_NEG_STRINGS) {
          if (!known) continue;
          result = result.replace(known, '');
          const coreKnown = known.replace(/,\\s*$/, '');
          result = result.replace(coreKnown, '');
        }
        
        if (negStr) {
          result = negStr + (negStr.endsWith(' ') || negStr.endsWith(',') ? '' : ', ') + result;
        }
      }
      
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });
  }, [setEditorText, setNegativeEditorText]);`);

// skip the broken block until we find handleTogglePart
while (i < lines.length) {
    if (lines[i].includes('const handleTogglePart = (id: string) => {')) {
        break;
    }
    i++;
}

while (i < lines.length) {
    newCode.push(lines[i]);
    i++;
}

fs.writeFileSync('src/App.tsx', newCode.join('\n'));
console.log("Done clean fix");
