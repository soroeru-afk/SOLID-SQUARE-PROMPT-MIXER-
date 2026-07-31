const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for AttributeMixer constants
if (!code.includes('ALL_KNOWN_POS_STRINGS')) {
  code = code.replace("import { AttributeMixer } from './components/AttributeMixer';", "");
  code = code.replace("import { VariationColumn } from './components/VariationColumn';", "import { VariationColumn } from './components/VariationColumn';\nimport { ALL_KNOWN_POS_STRINGS, ALL_KNOWN_NEG_STRINGS } from './components/AttributeMixer';");
}

// 2. Add handleMixAttributes function
const handleMixRegex = /const handleMixAttributes = [\s\S]*?\};/;
if (code.match(handleMixRegex)) {
  code = code.replace(handleMixRegex, '');
}

const handleMixAttributesFn = `
  const handleMixAttributes = useCallback((posStr: string, negStr: string) => {
    // We want to remove any known pos/neg string from the current text, then prepend the new one.
    // Also consider removing trailing/leading commas or spaces caused by removal.

    const cleanUpText = (text: string, knownStrings: string[], newInsert: string) => {
      let result = text;
      
      // Remove known exact strings
      knownStrings.forEach(known => {
        if (!known) return;
        // Escape for regex (just in case, though they contain standard characters and parens)
        const escaped = known.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
        const regex = new RegExp(escaped, 'g');
        result = result.replace(regex, '');
      });

      // Cleanup stray commas and spaces
      result = result.replace(/,\\s*,/g, ',');
      result = result.replace(/^,\\s*/, '');
      result = result.trim();

      // Prepend the new string
      if (newInsert) {
        return newInsert + result;
      }
      return result;
    };

    setEditorText(prev => cleanUpText(prev, ALL_KNOWN_POS_STRINGS, posStr));
    setNegativeEditorText(prev => cleanUpText(prev, ALL_KNOWN_NEG_STRINGS, negStr));
  }, [setEditorText, setNegativeEditorText]);
`;

const insertTarget = /const handleTogglePart = \(id: string\) => \{/;
code = code.replace(insertTarget, handleMixAttributesFn + '\n  ' + 'const handleTogglePart = (id: string) => {');

// 3. Pass it to VariationColumn
// First VariationColumn (swapped)
const vCol1Regex = /<VariationColumn([\s\S]*?)onCopyBulkToMaster=\{handleCopyBulkToMaster\}/;
code = code.replace(vCol1Regex, `<VariationColumn$1onCopyBulkToMaster={handleCopyBulkToMaster}\n              onMixAttributes={handleMixAttributes}`);

// Second VariationColumn (normal)
const vCol2Regex = /<VariationColumn([\s\S]*?)onCopyBulkToMaster=\{handleCopyBulkToMaster\}\n              lang=\{lang\}\n            \/>/g;

// Instead of regex, let's just do simple replacements, but be careful.
// Let's replace "onCopyBulkToMaster={handleCopyBulkToMaster}" with "onCopyBulkToMaster={handleCopyBulkToMaster} onMixAttributes={handleMixAttributes}"
code = code.replace(/onCopyBulkToMaster=\{handleCopyBulkToMaster\}/g, "onCopyBulkToMaster={handleCopyBulkToMaster}\n              onMixAttributes={handleMixAttributes}");

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App");
