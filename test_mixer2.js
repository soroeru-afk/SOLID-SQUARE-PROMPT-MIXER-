const ALL_KNOWN = ['japanese girl, (fair pale skin texture:1.3), ', 'british girl, (creamy white skin, elegant sharp facial features:1.3), '];
let editorText = 'japanese girl, (fair pale skin texture:1.3), 1girl, smile';
const posStr = 'british girl, (creamy white skin, elegant sharp facial features:1.3), ';
const targetToReplace = '';

let result = editorText;
if (targetToReplace) {
  result = result.replace(new RegExp(targetToReplace, 'gi'), posStr);
} else {
  for (const known of ALL_KNOWN) {
    if (!known) continue;
    result = result.replace(known, '');
    const coreKnown = known.replace(/,\s*$/, '');
    result = result.replace(coreKnown, '');
  }
  if (posStr) {
    result = posStr + (posStr.endsWith(' ') || posStr.endsWith(',') ? '' : ', ') + result;
  }
}
result = result.replace(/,\s*,/g, ',');
result = result.replace(/^,\s*/, '');
console.log(result.trim());
