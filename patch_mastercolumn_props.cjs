const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Instance 1
code = code.replace(
  /onReorderNegative=\{handleReorderNegatives\}\n\s*activeTab=\{activeMasterTab\}/g,
  "onReorderNegative={handleReorderNegatives}\n              onCopyToPart={(master) => setSavePartFromMasterData({ name: master.name, content: master.content })}\n              onCopyBulkToPart={(masters) => setSavePartFromMasterData({ items: masters.map(m => ({ name: m.name, content: m.content })) })}\n              activeTab={activeMasterTab}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
