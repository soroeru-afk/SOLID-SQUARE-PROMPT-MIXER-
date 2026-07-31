const fs = require('fs');
let variation = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

variation = variation.replace(
  /<option value="" disabled>Move to\.\.\.<\/option>/g,
  '<option value="" disabled className="bg-bg-panel text-text-dim">Move to...</option>'
);
variation = variation.replace(
  /<option value="copy_to_master">\{t\('copy_to_master_prompts', lang\)\}<\/option>/g,
  '<option value="copy_to_master" className="bg-bg-panel text-text-main">{t(\'copy_to_master_prompts\', lang)}</option>'
);
variation = variation.replace(
  /<option disabled>──────────<\/option>/g,
  '<option disabled className="bg-bg-panel text-text-dim">──────────</option>'
);
variation = variation.replace(
  /<option key=\{\`\$\{sec\}:\$\{cat\}\`\} value=\{\`\$\{sec\}:\$\{cat\}\`\}>/g,
  '<option key={`${sec}:${cat}`} value={`${sec}:${cat}`} className="bg-bg-panel text-text-main">'
);

fs.writeFileSync('src/components/VariationColumn.tsx', variation);
console.log("Patched VariationColumn options");
