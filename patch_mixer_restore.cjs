const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const restoreEffect = `
  useEffect(() => {
    const handleRestore = (e: any) => {
      const { positive, negative } = e.detail;
      const next = { ...selections };
      let remainingNeg = negative || '';
      let hasChanges = false;
      
      categories.forEach(c => {
        const items = presets[c.id] || DEFAULT_PRESETS[c.id] || [{ label: '指定なし / None', value: '' }];
        const targetStr = c.isNegative ? negative : positive;
        
        if (!targetStr) return;
        
        let bestMatchIdx = 0;
        let bestMatchLen = 0;
        let bestMatchVal = '';
        
        for (let i = 1; i < items.length; i++) {
          const val = items[i].value;
          if (val && targetStr.includes(val)) {
            if (val.length > bestMatchLen) {
              bestMatchLen = val.length;
              bestMatchIdx = i;
              bestMatchVal = val;
            }
          }
        }
        
        if (bestMatchIdx !== 0 && next[c.id] !== bestMatchIdx) {
          next[c.id] = bestMatchIdx;
          hasChanges = true;
        }
        
        if (c.isNegative && bestMatchIdx !== 0) {
          remainingNeg = remainingNeg.replace(bestMatchVal, '');
        }
      });
      
      if (hasChanges) {
        setSelections(next);
      }
      
      remainingNeg = remainingNeg.split(',').map((s: string) => s.trim()).filter((s: string) => s).join(', ');
      if (remainingNeg !== negativePrompt) {
        setNegativePrompt(remainingNeg);
      }
      
      if (hasChanges || remainingNeg !== negativePrompt) {
        setSaveSuccessMessage(lang === 'en' ? 'Restored from Image!' : '画像からプロンプトを復元しました！');
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      }
    };

    window.addEventListener('restore_mixer_from_prompt', handleRestore);
    return () => window.removeEventListener('restore_mixer_from_prompt', handleRestore);
  }, [categories, presets, selections, negativePrompt, lang]);
`;

// Insert after the existing handleImported useEffect
const importedRegex = /window\.removeEventListener\('mixer_presets_updated', handleImported\);\s*\};\s*\}, \[\]\);/;

if (importedRegex.test(content)) {
  content = content.replace(importedRegex, match => match + '\n' + restoreEffect);
  fs.writeFileSync('src/components/AttributeMixer.tsx', content);
  console.log("Patched successfully");
} else {
  console.log("Could not find insertion point.");
}

