const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const regex = /className=\{\`p-2 rounded flex items-center space-x-2 cursor-pointer transition-colors group relative \$\{\s*isSelected \? \(part\.isNegative \? 'bg-red-500\/20 border border-red-500\/60 shadow-\[0_0_8px_rgba\(239,68,68,0\.3\)\]' : 'bg-bg-surface border border-blue-500\/30'\) : \(part\.isNegative \? 'bg-red-500\/10 border border-red-500\/40 hover:bg-red-500\/20 hover:border-red-500\/60' : 'bg-bg-input border border-border-main hover:border-border-hover'\)\s*\}\`\}/m;

const newClass = "className={`p-2 rounded flex items-center space-x-2 cursor-pointer transition-colors group relative ${isSelected ? (part.isNegative ? 'bg-red-500/10 border border-red-500/50' : 'bg-bg-surface border border-blue-500/30') : (part.isNegative ? 'bg-red-500/5 border border-red-500/30 hover:border-red-500/50' : 'bg-bg-input border border-border-main hover:border-border-hover')}`}";

if (regex.test(code)) {
    code = code.replace(regex, newClass);
    fs.writeFileSync('src/components/VariationColumn.tsx', code);
    console.log("Fixed VariationColumn background classes to be more subtle");
} else {
    console.log("Regex not found");
}
