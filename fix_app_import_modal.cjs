const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('ImportModal')) {
  content = content.replace(
    /import \{ SaveMasterModal \} from '\.\/components\/SaveMasterModal';/,
    `import { SaveMasterModal } from './components/SaveMasterModal';\nimport { ImportModal } from './components/ImportModal';`
  );

  // add state
  content = content.replace(
    /const \[loadSuccessMessage, setLoadSuccessMessage\] = useState<string \| null>\(null\);/,
    `const [loadSuccessMessage, setLoadSuccessMessage] = useState<string | null>(null);\n  const [importPendingData, setImportPendingData] = useState<any>(null);`
  );

  // modify handleImport
  const newImport = `const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.masters && parsed.parts) {
          setImportPendingData(parsed);
        } else {
          alert('Invalid JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const executeImport = (shouldMerge: boolean) => {
    if (!importPendingData) return;
    const parsed = importPendingData;
    
    if (shouldMerge) {
      setData(prev => {
        const mergeArray = (oldArr: any[], newArr: any[]) => {
          const map = new Map();
          oldArr.forEach(item => map.set(item.id, item));
          newArr.forEach(item => {
            if (!map.has(item.id)) {
              map.set(item.id, item);
            }
          });
          return Array.from(map.values());
        };

        const mergeCategories = (oldCats: any[], newCats: any[]) => {
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
      mergeMixerData(parsed);
    } else {
      setData(parsed);
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
    setImportPendingData(null);
    setLoadSuccessMessage(lang === 'en' ? 'Import completed!' : 'インポートが完了しました！');
    setTimeout(() => setLoadSuccessMessage(null), 3000);
  };`;

  content = content.replace(/const handleImport = \(\s*e: React\.ChangeEvent<HTMLInputElement>\s*\) => \{[\s\S]*?e\.target\.value = '';\s*\};/, newImport);

  // insert ImportModal component
  content = content.replace(
    /<\/main>\s*<\/div>\s*\)\;\s*\}\s*$/,
    `      <ImportModal
        isOpen={importPendingData !== null}
        onMerge={() => executeImport(true)}
        onOverwrite={() => executeImport(false)}
        onCancel={() => setImportPendingData(null)}
        lang={lang}
      />
      </main>
    </div>
  );
}`
  );

  fs.writeFileSync('src/App.tsx', content);
  console.log('Fixed handleImport and added ImportModal');
}
