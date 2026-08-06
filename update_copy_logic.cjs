const fs = require('fs');

// 1. Update AttributeMixer.tsx
let attrContent = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');
attrContent = attrContent.replace(
  /onCopyToParts\?\: \(parts\: VariationPart\[\], categories\: \{ name\: string\, section\: number \}\[\]\) \=\> void;/,
  'onCopyToParts?: (parts: VariationPart[], categories: { name: string, section: number }[]) => { added: number, skipped: number };'
);

attrContent = attrContent.replace(
  /onCopyToParts\(newParts, newCategories\);\s*\/\/\s*オプションで完了メッセージを表示\s*setSaveSuccessMessage\(lang === 'en' \? "Copied to Parts!" : "パーツにコピーしました！"\);/,
  `const result = onCopyToParts(newParts, newCategories);\n    \n    // オプションで完了メッセージを表示\n    if (result) {\n      setSaveSuccessMessage(lang === 'en' ? \`\${result.added} added, \${result.skipped} skipped\` : \`\${result.added}件追加 (\${result.skipped}件スキップ)\`);\n    } else {\n      setSaveSuccessMessage(lang === 'en' ? "Copied to Parts!" : "パーツにコピーしました！");\n    }`
);
fs.writeFileSync('src/components/AttributeMixer.tsx', attrContent);

// 2. Update VariationColumn.tsx
let varContent = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');
varContent = varContent.replace(
  /onCopyToParts\?\: \(parts\: VariationPart\[\], categories\: \{ name\: string\, section\: number \}\[\]\) \=\> void;/,
  'onCopyToParts?: (parts: VariationPart[], categories: { name: string, section: number }[]) => { added: number, skipped: number };'
);
fs.writeFileSync('src/components/VariationColumn.tsx', varContent);

// 3. Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /const handleCopyToParts = useCallback\(\(newParts: VariationPart\[\], newCategories: \{ name: string, section: number \}\[\]\) => \{/,
  'const handleCopyToParts = useCallback((newParts: VariationPart[], newCategories: { name: string, section: number }[]) => {\n    let added = 0;\n    let skipped = 0;'
);

appContent = appContent.replace(
  /return false; \/\/ すでに同じものがある場合はスキップ/,
  'skipped++;\n          return false; // すでに同じものがある場合はスキップ'
);

appContent = appContent.replace(
  /existingPartsSet\.add\(key\); \/\/ newParts同士での重複も防ぐ\s*return true;/,
  'existingPartsSet.add(key); // newParts同士での重複も防ぐ\n        added++;\n        return true;'
);

appContent = appContent.replace(
  /parts: \[\.\.\.uniqueNewParts\, \.\.\.prev\.parts\]\,\s*customCategories: \[\.\.\.\(prev\.customCategories \|\| \[\]\)\, \.\.\.additionalCatsUnique\]\s*\}\;\s*\}\)\;\s*\}\, \[\]\)\;/,
  `parts: [...uniqueNewParts, ...prev.parts],
        customCategories: [...(prev.customCategories || []), ...additionalCatsUnique]
      };
    });
    return { added, skipped };
  }, []);`
);

fs.writeFileSync('src/App.tsx', appContent);
console.log('Done updating copy logic');
