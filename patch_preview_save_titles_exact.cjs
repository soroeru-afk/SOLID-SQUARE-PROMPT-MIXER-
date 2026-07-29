const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Fix handleSavePartClick
code = code.replace(
  /const title = selectedMasterId && selectedMasterName \? selectedMasterName : \(firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine\);\n\s*setSavePartItems\(undefined\);\n\s*setSavePartContent\(text\.trim\(\)\);\n\s*setSavePartDefaultName\(title\);/,
  `const name = selectedPartId && selectedPartName ? selectedPartName : (firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine);
      setSavePartItems(undefined);
      setSavePartContent(text.trim());
      setSavePartDefaultName(name);`
);

// Fix handleSaveSetClick
code = code.replace(
  /const firstLine = posText \? posText\.split\('\\n'\)\[0\] : negText\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*setSaveMasterItems\(undefined\);/,
  `const firstLine = posText ? posText.split('\\n')[0] : negText.split('\\n')[0];
    const title = selectedMasterId && selectedMasterName ? selectedMasterName : (firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine);
    
    setSaveMasterItems(undefined);`
);

// Fix handleSaveMasterClick
code = code.replace(
  /const firstLine = text\.trim\(\)\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*setSaveMasterItems\(undefined\);/,
  `const firstLine = text.trim().split('\\n')[0];
      const title = targetIsNegative 
        ? (selectedNegativeId && selectedNegativeName ? selectedNegativeName : (firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine))
        : (selectedMasterId && selectedMasterName ? selectedMasterName : (firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine));
      setSaveMasterItems(undefined);`
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched exact");
