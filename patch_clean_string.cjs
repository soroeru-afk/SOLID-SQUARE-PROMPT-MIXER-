const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const regexCleanString = /const cleanString = \(text: string, force: boolean = false\) => \{[\s\S]*?\.trim\(\);\n  \};/m;

const newCleanString = `const cleanString = (text: string, force: boolean = false) => {
    if (!autoOptimize && !force) return text;
    return text
      .split('\\n')
      .map(line => 
        line
          .replace(/[\\u3000]/g, ' ')
          .replace(/[ \\t]+/g, ' ')
          .replace(/\\.\\s*,/g, ',')
          .replace(/\\.\\s*$/g, '')
          .replace(/(^|,\\s*)\\.(?=$|\\s*,)/g, '$1')
          .replace(/[ \\t]+,/g, ',')
          .replace(/,+/g, ',')
          .replace(/,[ \\t]*,/g, ',')
          .replace(/,([^\\s])/g, ', $1')
          .trim()
      )
      .join('\\n')
      .replace(/\\n{3,}/g, '\\n\\n')
      .replace(/^[\\s,]+|[\\s,]+$/g, '')
      .trim();
  };`;

code = code.replace(regexCleanString, newCleanString);
fs.writeFileSync('src/components/PreviewColumn.tsx', code);
