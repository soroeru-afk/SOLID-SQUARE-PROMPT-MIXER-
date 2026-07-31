const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = "const handleMixAttributes = useCallback((posStr: string";
const startIdx = code.indexOf(startStr);
if (startIdx !== -1) {
  const endStr = "  }, [setEditorText, setNegativeEditorText]);";
  const actualEndIdx = code.indexOf(endStr, startIdx);
  
  if (actualEndIdx !== -1) {
    const toReplace = code.substring(startIdx - 2, actualEndIdx + endStr.length);
    
    const replacement = `  const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
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
        // 対象の単語（例：Japanese）が含まれる「タグ要素ごと」を削除し、そこに新しい属性を挿入する
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'i');
        const parts = splitRespectingParens(result);
        let replaced = false;
        
        const newParts = parts.filter(part => {
          if (targetRegex.test(part)) {
            replaced = true;
            return false; // タグごと消す
          }
          return true; // 残す
        });
        
        if (replaced) {
          // 置換が発生した場合、新しい属性群を先頭に挿入する
          result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + newParts.join(', ');
        } else {
          // 見つからなかった場合も先頭に挿入
          if (posStr) {
            result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + result;
          }
        }
      } else {
        // targetToReplaceがない場合
        // ALL_KNOWN_POS_STRINGSをカンマ区切りの個別のタグに分解してから削除する
        const allKnownTags = [];
        for (const known of ALL_KNOWN_POS_STRINGS) {
          if (!known) continue;
          const parts = splitRespectingParens(known);
          allKnownTags.push(...parts);
        }
        
        const parts = splitRespectingParens(result);
        const newParts = parts.filter(part => {
          // もしpartが既知のタグと一致したら削除
          const pLower = part.toLowerCase();
          return !allKnownTags.some(k => k.toLowerCase() === pLower);
        });
        
        result = newParts.join(', ');
        if (posStr) {
          result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + result;
        }
      }
      
      // 余分なカンマや先頭のカンマをクリーンアップ
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
  }, [setEditorText, setNegativeEditorText]);`;

    code = code.substring(0, startIdx - 2) + replacement + code.substring(actualEndIdx + endStr.length);
    
    // Cleanup any duplicates
    while (code.indexOf(startStr, startIdx + replacement.length) !== -1) {
      const s = code.indexOf(startStr, startIdx + replacement.length);
      const e = code.indexOf(endStr, s);
      if (e !== -1) {
        code = code.substring(0, s - 2) + code.substring(e + endStr.length);
      } else {
        break;
      }
    }
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Fixed App.tsx precisely");
  }
}
