const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleMixAttributes = useCallback\([\s\S]*?\}, \[setEditorText, setNegativeEditorText\]\);/;

const safeFn = `const handleMixAttributes = useCallback((posStr: string, negStr: string) => {
    const coreKeywords = [
      'japanese woman', 'british woman', 'russian woman', 'brazilian woman',
      '1mature female', '1middle-aged female', '1japanese high school girl', 
      'mature female', 'middle-aged female', 'japanese high school girl',
      'slender and beautiful body', 'athletic olistic heavyweight', 'large heavy fat body',
      'full length shot', 'medium shot', 'three-quarter view angle', 'absolute full-length side view', 'camera at ground level height',
      '1old japanese man focus', '1japanese high school boy', '1muscular skinny american man focus'
    ];

    const cleanUpText = (text: string, knownStrings: string[], newInsert: string, isPos: boolean) => {
      let result = text;
      
      let firstKnown = '';
      let minIdx = -1;
      
      const searchStrings = isPos ? [...coreKeywords, ...knownStrings] : knownStrings;

      // Step 1: Find the earliest occurrence of ANY known string
      for (const known of searchStrings) {
        if (!known) continue;
        
        let idx = result.indexOf(known);
        let searchStr = known;
        
        if (idx === -1) {
          searchStr = known.replace(/,\\s*$/, '');
          idx = result.indexOf(searchStr);
        }
        
        if (idx !== -1 && (minIdx === -1 || idx < minIdx)) {
          minIdx = idx;
          firstKnown = searchStr;
        }
      }

      // Step 2: Replace the first occurrence with a marker
      if (minIdx !== -1 && newInsert) {
        result = result.replace(firstKnown, '___MARKER___');
      }

      // Step 3: Remove all occurrences of ALL known strings
      for (const known of searchStrings) {
        if (!known) continue;
        const coreKnown = known.replace(/,\\s*$/, '');
        
        result = result.split(known).join('');
        result = result.split(coreKnown).join('');
      }

      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      result = result.trim();

      // Step 4: Insert new text
      if (newInsert) {
        if (minIdx !== -1) {
          result = result.replace('___MARKER___', newInsert);
        } else {
          result = newInsert + (result.length > 0 && !newInsert.endsWith(' ') ? ' ' : '') + result;
        }
      } else {
        result = result.replace('___MARKER___', '');
      }

      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      result = result.trim();
      
      return result;
    };

    setEditorText(prev => cleanUpText(prev, ALL_KNOWN_POS_STRINGS, posStr, true));
    setNegativeEditorText(prev => cleanUpText(prev, ALL_KNOWN_NEG_STRINGS, negStr, false));
  }, [setEditorText, setNegativeEditorText]);`;

code = code.replace(regex, safeFn);
fs.writeFileSync('src/App.tsx', code);
console.log("Updated handleMixAttributes logic with core keywords");
