const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const regex = /1: \{ name: t\('sec_composition' as any, lang\), categories: \{\} as Record<string, VariationPart\[\]> \},\s*2: \{ name: t\('sec_pose' as any, lang\), categories: \{\} as Record<string, VariationPart\[\]> \},\s*3: \{ name: t\('sec_details' as any, lang\), categories: \{\} as Record<string, VariationPart\[\]> \},\s*4: \{ name: t\('sec_context' as any, lang\), categories: \{\} as Record<string, VariationPart\[\]> \},/;

const replacement = `1: { name: customSectionNames[1] || t('sec_composition' as any, lang), categories: {} as Record<string, VariationPart[]> },
      2: { name: customSectionNames[2] || t('sec_pose' as any, lang), categories: {} as Record<string, VariationPart[]> },
      3: { name: customSectionNames[3] || t('sec_details' as any, lang), categories: {} as Record<string, VariationPart[]> },
      4: { name: customSectionNames[4] || t('sec_context' as any, lang), categories: {} as Record<string, VariationPart[]> },`;

code = code.replace(regex, replacement);

// We should also add customSectionNames to dependency array of useMemo
const regexDep = /}, \[filteredParts, customCategories, lang\]\);/;
code = code.replace(regexDep, "}, [filteredParts, customCategories, customSectionNames, lang]);");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
