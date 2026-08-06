const fs = require('fs');
let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

content = content.replace("      }\n      }\n    };", "      }\n    };");

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
console.log('Fixed extra brace again');
