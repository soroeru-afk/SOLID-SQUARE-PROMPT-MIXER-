const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleMixAttributes = useCallback\([\s\S]*?\}, \[setEditorText, setNegativeEditorText\]\);/;

const safeFn = `const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    const escapeRegExp = (str: string) => {
      return str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    };

    setEditorText(prev => {
      let result = prev;
      
      // もし対象文字が指定されていれば、単純な文字列置換を行う（ユーザー要望: 普通に検索の置き換えと同じ）
      if (targetToReplace) {
        const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
        if (targetRegex.test(result)) {
          result = result.replace(targetRegex, posStr);
        } else {
          // 見つからなかった場合は先頭に挿入
          if (posStr) {
            result = posStr + (result.length > 0 && !posStr.endsWith(' ') ? ' ' : '') + result;
          }
        }
      } else {
        // 対象文字がない場合は、以前の属性（ALL_KNOWN_POS_STRINGS）を綺麗に削除してから先頭に挿入する
        for (const known of ALL_KNOWN_POS_STRINGS) {
          if (!known) continue;
          const coreKnown = known.replace(/,\\s*$/, '');
          
          const regex1 = new RegExp(escapeRegExp(known), 'gi');
          const regex2 = new RegExp(escapeRegExp(coreKnown), 'gi');
          result = result.replace(regex1, '');
          result = result.replace(regex2, '');
        }
        
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
console.log("Updated handleMixAttributes logic cleanly.");
