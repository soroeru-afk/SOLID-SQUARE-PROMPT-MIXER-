const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {";
const replacement = `const handleMixAttributes = useCallback((posStr: string, negStr: string, targetToReplace?: string) => {
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
