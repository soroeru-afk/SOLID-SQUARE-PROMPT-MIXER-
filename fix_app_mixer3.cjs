const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleMixAttributes = useCallback\([\s\S]*?\}, \[setEditorText, setNegativeEditorText\]\);/;

const safeFn = `const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
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
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current);
      return parts;
    };

    setEditorText(prev => {
      let result = prev;
      
      const targetRegex = targetToReplace ? new RegExp(escapeRegExp(targetToReplace), 'i') : null;
      
      if (targetRegex && targetRegex.test(result)) {
        const parts = splitRespectingParens(result);
        
        const newParts = parts.map(part => {
          if (targetRegex.test(part)) {
            return '___MARKER___';
          }
          return part;
        });
        
        // 連続するマーカーを1つにまとめる
        const condensedParts: string[] = [];
        for (const p of newParts) {
          if (p === '___MARKER___') {
            if (condensedParts.length === 0 || condensedParts[condensedParts.length - 1] !== '___MARKER___') {
              condensedParts.push(p);
            }
          } else {
            condensedParts.push(p);
          }
        }
        
        result = condensedParts.join(',');
        result = result.replace(/___MARKER___/g, posStr);
      } else {
        // 含まれていない、もしくは空の場合は先頭に挿入
        if (posStr) {
          result = posStr + (result.length > 0 && !posStr.endsWith(' ') ? ' ' : '') + result;
        }
      }
      
      // 余分なカンマや先頭のカンマをクリーンアップ
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });

    setNegativeEditorText(prev => {
      let result = prev;
      
      // 既存のネガティブ（パートナー関連）の削除処理
      for (const known of ALL_KNOWN_NEG_STRINGS) {
        if (!known) continue;
        const coreKnown = known.replace(/,\\s*$/, '');
        
        // 大文字小文字を区別せずに削除
        const regex1 = new RegExp(escapeRegExp(known), 'gi');
        const regex2 = new RegExp(escapeRegExp(coreKnown), 'gi');
        result = result.replace(regex1, '');
        result = result.replace(regex2, '');
      }
      
      if (negStr) {
        result = negStr + (result.length > 0 && !negStr.endsWith(' ') ? ' ' : '') + result;
      }
      
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      return result.trim();
    });
  }, [setEditorText, setNegativeEditorText]);`;

code = code.replace(regex, safeFn);
fs.writeFileSync('src/App.tsx', code);
console.log("Updated App mixer logic with parens-aware splitting");
