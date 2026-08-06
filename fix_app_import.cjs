const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newImport = `const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmMessage = lang === 'en' ? 'Do you want to merge the imported data with the current data?\\n(OK = Merge, Cancel = Overwrite completely)' : 'インポートするデータを現在のデータと結合（マージ）しますか？\\n（「OK」で結合、「キャンセル」で完全に上書き）';
    const shouldMerge = window.confirm(confirmMessage);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.masters && parsed.parts) {
          if (shouldMerge) {
            setData(prev => {
              const mergeArray = (oldArr, newArr) => {
                const map = new Map();
                oldArr.forEach(item => map.set(item.id, item));
                newArr.forEach(item => {
                  if (!map.has(item.id)) {
                    map.set(item.id, item);
                  }
                });
                return Array.from(map.values());
              };

              // For customCategories (they don't have id, they have section and name)
              const mergeCategories = (oldCats, newCats) => {
                const map = new Set(oldCats.map(c => \`\${c.section}-\${c.name}\`));
                const merged = [...oldCats];
                newCats.forEach(c => {
                  if (!map.has(\`\${c.section}-\${c.name}\`)) {
                    merged.push(c);
                    map.add(\`\${c.section}-\${c.name}\`);
                  }
                });
                return merged;
              };

              return {
                masters: mergeArray(prev.masters, parsed.masters),
                parts: mergeArray(prev.parts, parsed.parts),
                memos: mergeArray(prev.memos || [], parsed.memos || []),
                customCategories: mergeCategories(prev.customCategories || [], parsed.customCategories || [])
              };
            });
            mergeMixerData(parsed); // mergeMixerData is already updated to merge
          } else {
            setData(parsed);
            
            // Overwrite mixer data entirely if not merging
            if (parsed.attributeMixerCategories) {
              localStorage.setItem('attribute_mixer_categories_v2', typeof parsed.attributeMixerCategories === 'string' ? parsed.attributeMixerCategories : JSON.stringify(parsed.attributeMixerCategories));
            }
            if (parsed.attributeMixerPresets) {
              localStorage.setItem('attribute_mixer_custom_presets_v7', typeof parsed.attributeMixerPresets === 'string' ? parsed.attributeMixerPresets : JSON.stringify(parsed.attributeMixerPresets));
            }
            if (parsed.attributeMixerCombos) {
              localStorage.setItem('attribute_mixer_combinations_v1', typeof parsed.attributeMixerCombos === 'string' ? parsed.attributeMixerCombos : JSON.stringify(parsed.attributeMixerCombos));
            }
            window.dispatchEvent(new Event('attributeMixerDataImported'));
          }
          setSelectedMasterId(parsed.masters[0]?.id || null);
        } else {
          alert('Invalid JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };`;

content = content.replace(/const handleImport = \(\s*e: React\.ChangeEvent<HTMLInputElement>\s*\) => \{[\s\S]*?e\.target\.value = ''; \/\/ reset input\s*\};/, newImport);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed handleImport');
