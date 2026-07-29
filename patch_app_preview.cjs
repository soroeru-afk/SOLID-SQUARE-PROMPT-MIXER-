const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find selectedPartName calculation. We might need to compute it.
// Let's just pass them directly in the PreviewColumn JSX.

code = code.replace(
  /<PreviewColumn\n\s*tabs=\{tabs\}/g,
  `<PreviewColumn
          selectedMasterId={selectedMasterId}
          selectedMasterName={selectedMasterId ? data.masters.find(m => m.id === selectedMasterId)?.name : undefined}
          selectedNegativeId={selectedNegativeId}
          selectedNegativeName={selectedNegativeId ? data.negatives?.find(m => m.id === selectedNegativeId)?.name : undefined}
          selectedPartId={selectedPartIds.size === 1 ? Array.from(selectedPartIds)[0] : undefined}
          selectedPartName={selectedPartIds.size === 1 ? data.parts.find(p => p.id === Array.from(selectedPartIds)[0])?.name : undefined}
          tabs={tabs}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App PreviewColumn props");
