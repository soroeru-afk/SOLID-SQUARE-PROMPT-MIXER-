const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const lines = code.split('\n');
const newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("{/* We move Expand All / Collapse All under the search bar later down */}")) {
        skip = true;
    }
    if (skip) {
        if (lines[i].includes("</div>") && lines[i-1].includes("</button>") && lines[i-2] && lines[i-2].includes("expand_all")) {
            // we found the button block closure, wait for the next closing braces
            skip = false;
            // wait, we also need to skip the closing `)}`
            i += 1;
            continue;
        }
        continue;
    }
    newLines.push(lines[i]);
}

fs.writeFileSync('src/components/VariationColumn.tsx', newLines.join('\n'));
console.log("Removed old expand block");
