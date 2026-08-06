const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const replacement = `
        const metadata = await extractMetadataFromImage(file);
        if (metadata) {
          let pos = '';
          let neg = '';
          if (metadata.positive) {
            pos = metadata.positive;
            setEditorText(prev => prev ? prev + '\\n' + metadata.positive : metadata.positive);
          }
          if (metadata.negative) {
            neg = metadata.negative;
            setNegativeEditorText(prev => prev ? prev + '\\n' + metadata.negative : metadata.negative);
          }
          if (pos || neg) {
            window.dispatchEvent(new CustomEvent('restore_mixer_from_prompt', {
              detail: { positive: pos, negative: neg }
            }));
          }
        }
`;

content = content.replace(
  /const metadata = await extractMetadataFromImage\(file\);[\s\S]*?if\s*\(metadata\.negative\)\s*\{\s*setNegativeEditorText\(prev => prev \? prev \+ '\\n' \+ metadata\.negative : metadata\.negative\);\s*\}\s*\}/,
  replacement.trim()
);

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
