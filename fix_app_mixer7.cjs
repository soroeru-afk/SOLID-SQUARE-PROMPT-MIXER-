const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

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

// Wipe out all versions of handleMixAttributes
const startStr = "  const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {";
const endStr = "  }, [setEditorText, setNegativeEditorText]);";

const lines = code.split('\n');
let newLines = [];
let inside = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const handleMixAttributes = useCallback')) {
    inside = true;
    continue;
  }
  if (inside) {
    if (lines[i].includes('}, [setEditorText, setNegativeEditorText]);')) {
      inside = false;
      // Also skip any trailing garbage like ');' if it's on the same or next line
      if (lines[i].includes("');")) {
        // Just let it skip
      }
    } else if (lines[i].startsWith("    };") && lines[i+1] && lines[i+1].includes("    const splitRespectingParens")) {
       // Just skipping corrupted stuff
    }
    continue;
  }
  newLines.push(lines[i]);
}

// Now insert our replacement before handleTogglePart
const togglePartIdx = newLines.findIndex(l => l.includes('const handleTogglePart ='));
if (togglePartIdx !== -1) {
  newLines.splice(togglePartIdx, 0, ...replacement.split('\n'), '');
}

// Ensure no stray ');' before handleTogglePart
for (let i = togglePartIdx - 5; i < togglePartIdx + 5; i++) {
  if (newLines[i] && newLines[i].trim() === "');") {
    newLines[i] = "";
  }
}

fs.writeFileSync('src/App.tsx', newLines.join('\n'));
console.log('Fixed App.tsx regex completely');
