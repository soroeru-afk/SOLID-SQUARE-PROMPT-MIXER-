const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

code = code.replace(/      \)\}\n      \) : \(\n        children\n      \)\}/, "      )}\n      </>\n      ) : (\n        children\n      )}");

fs.writeFileSync('src/components/VariationColumn.tsx', code);
