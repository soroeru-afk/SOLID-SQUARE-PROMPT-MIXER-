const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');

const startIndex = lines.findIndex(l => l.includes('const handleMixAttributes = '));
const endIndex = lines.findIndex(l => l.includes('const handleTogglePart = '));

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex, `  const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    };

    setEditorText(prev => {
      let result = prev;
      let replaced = false;
      
      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
        const originalResult = result;
        result = result.replace(targetRegex, posStr);
        if (result !== originalResult) {
          replaced = true;
        }
      } 
      
      if (!replaced && posStr) {
        result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + result;
      }
      
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });

    setNegativeEditorText(prev => {
      let result = prev;
      let replaced = false;
      
      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
        if (result.match(targetRegex)) {
            result = result.replace(targetRegex, negStr);
            replaced = true;
        }
      }
      
      if (!replaced && negStr) {
        result = negStr + (negStr.endsWith(' ') || negStr.endsWith(',') ? '' : ', ') + result;
      }
      
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });
  }, [setEditorText, setNegativeEditorText]);\n`);
}
fs.writeFileSync('src/App.tsx', lines.join('\n'));
