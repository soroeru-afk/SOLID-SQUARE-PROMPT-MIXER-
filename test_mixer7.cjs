const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const match = code.match(/const handleMixAttributes = useCallback\(\(posStr: string, negStr: string, targetToReplace\?: string\) => \{([\s\S]*?)\}, \[setEditorText, setNegativeEditorText\]\);/);
if (match) {
    const fnBody = match[1];
    
    // Evaluate the inner function body for setEditorText
    const setterMatch = fnBody.match(/setEditorText\(prev => \{([\s\S]*?)\}\);/);
    if (setterMatch) {
        let setterBody = setterMatch[1].replace('return result.trim();', 'finalResult = result.trim();');
        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const ALL_KNOWN_POS_STRINGS = ['japanese girl, ', 'british girl, '];
        
        const testCase = (prev, posStr, targetToReplace) => {
            let result = prev;
            let finalResult = '';
            eval(setterBody);
            console.log(`targetToReplace: "${targetToReplace}" -> ${finalResult}`);
        }
        testCase('1girl, smile', 'british girl, ', '');
        testCase('1girl, smile', 'british girl, ', ' '); // if user typed space
        testCase('1girl, smile', 'british girl, ', 'missing target');
        testCase('japanese girl, 1girl, smile', 'british girl, ', '');
    }
}
