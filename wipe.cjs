const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  const handleMixAttributes = useCallback[\s\S]*?const handleTogglePart = \(id: string\) => \{/g;
const replacement = `  const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    };

    const splitRespectingParens = (text: string): string[] => {
      const parts: string[] = [];
      let current = '';
      let parenDepth = 0;
      let bracketDepth = 0;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '(') parenDepth++;
        else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
        else if (char === '[') bracketDepth++;
        else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
        
        if (char === ',' && parenDepth === 0 && bracketDepth === 0) {
          parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      if (current.trim()) {
        parts.push(current.trim());
      }
      return parts;
    };

    setEditorText(prev => {
      let result = prev;
      
      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'i');
        const parts = splitRespectingParens(result);
        let replaced = false;
        
        const newParts = parts.filter(part => {
          if (targetRegex.test(part)) {
            replaced = true;
            return false;
          }
          return true;
        });
        
        if (replaced) {
          result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + newParts.join(', ');
        } else {
          if (posStr) {
            result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + result;
          }
        }
      } else {
        const allKnownTags = [];
        for (const known of ALL_KNOWN_POS_STRINGS) {
          if (!known) continue;
          const parts = splitRespectingParens(known);
          allKnownTags.push(...parts);
        }
        
        const parts = splitRespectingParens(result);
        const newParts = parts.filter(part => {
          const pLower = part.toLowerCase();
          return !allKnownTags.some(k => k.toLowerCase() === pLower);
        });
        
        result = newParts.join(', ');
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
      
      const allKnownTags = [];
      for (const known of ALL_KNOWN_NEG_STRINGS) {
        if (!known) continue;
        const parts = splitRespectingParens(known);
        allKnownTags.push(...parts);
      }
      
      const parts = splitRespectingParens(result);
      const newParts = parts.filter(part => {
        const pLower = part.toLowerCase();
        return !allKnownTags.some(k => k.toLowerCase() === pLower);
      });
      
      result = newParts.join(', ');
      
      if (negStr) {
        result = negStr + (negStr.endsWith(' ') || negStr.endsWith(',') ? '' : ', ') + result;
      }
      
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });
  }, [setEditorText, setNegativeEditorText]);

  const handleTogglePart = (id: string) => {`;

// Replace ALL occurrences of the region! So if there are nested ones, they all become just ONE valid one.
code = code.replace(regex, replacement);

// Wait, replace(regex, string) will replace the first match if regex is not global, or all if global.
// Wait! `[\s\S]*?` is lazy. If there are multiple `handleTogglePart`, it matches up to the first one!
// Let's use `indexOf` and `lastIndexOf` to wipe everything between the FIRST handleMixAttributes and the LAST handleTogglePart!
