const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  const handleMixAttributes = useCallback\([\s\S]*?\}, \[setEditorText, setNegativeEditorText\]\);/g;

const replacement = `  const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
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
  }, [setEditorText, setNegativeEditorText]);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed handleMixAttributes simply");
