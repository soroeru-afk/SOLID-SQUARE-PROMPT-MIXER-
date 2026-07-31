const ALL_KNOWN = ['japanese girl, (fair pale skin texture:1.3), '];
let editorText = '1girl, smile';
const posStr = 'british girl, (creamy white skin, elegant sharp facial features:1.3), ';
const targetToReplace = 'japanese girl'; // Not in the text

const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

let result = editorText;
if (targetToReplace) {
  const targetRegex = new RegExp(escapeRegExp(targetToReplace), 'gi');
  result = result.replace(targetRegex, posStr);
} else {
  // ...
}
console.log(result);
