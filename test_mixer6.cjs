const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const match = code.match(/const handleMixAttributes = useCallback\(\(posStr: string, negStr: string, targetToReplace\?: string\) => \{([\s\S]*?)\}, \[setEditorText, setNegativeEditorText\]\);/);
if (match) {
    const fnBody = match[1];
    
    // Simulate setEditorText
    let prev = '1girl, smile';
    let targetToReplace = '';
    let posStr = 'british girl, ';
    const ALL_KNOWN_POS_STRINGS = ['japanese girl, ', 'british girl, '];
    
    // Evaluate the inner function body for setEditorText
    // We have to extract the setEditorText callback
    const setterMatch = fnBody.match(/setEditorText\(prev => \{([\s\S]*?)\}\);/);
    if (setterMatch) {
        const setterBody = setterMatch[1];
        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        let result = prev;
        eval(setterBody);
        console.log("Result when targetToReplace is empty:", result);
    }
}
