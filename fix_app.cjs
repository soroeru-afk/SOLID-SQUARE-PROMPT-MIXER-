const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove import
code = code.replace("import { ALL_KNOWN_POS_STRINGS, ALL_KNOWN_NEG_STRINGS } from './components/AttributeMixer';", "");

// Rewrite handleMixAttributes
const mixRegex = /const handleMixAttributes = useCallback\(\(posStr: string, negStr: string, targetToReplace\?: string\) => \{[\s\S]*?\}, \[setEditorText, setNegativeEditorText\]\);/;

const newMixLogic = `const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
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
      
      // If we are placing negStr based on targetToReplace... wait, the user's targetToReplace is only in pos text?
      // For simplicity, we just prepend negStr if not replaced or always.
      if (targetToReplace) {
        // Typically targetToReplace is for positive prompt. If it was found there, maybe we just prepend negStr to negative?
        // Let's just prepend negStr to negative always if target is given, unless they put target in negative.
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
  }, [setEditorText, setNegativeEditorText]);`;

code = code.replace(mixRegex, newMixLogic);
fs.writeFileSync('src/App.tsx', code);
console.log("Updated handleMixAttributes in App.tsx");
