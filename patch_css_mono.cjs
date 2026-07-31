const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const newTheme = `
.theme-mono {
  --bg-base: #ffffff;
  --bg-panel: #f3f4f6;
  --bg-input: #ffffff;
  --bg-surface: #e5e7eb;
  --border-main: #000000;
  --border-hover: #000000;
  --text-main: #000000;
  --text-dim: #333333;
  --accent-main: #000000;
  --accent-dim: rgba(0, 0, 0, 0.1);
  --thumb-bg: #000000;
}
`;

code = code.replace(
  /.theme-navy \{/,
  newTheme + "\n.theme-navy {"
);

fs.writeFileSync('src/index.css', code);
console.log("Patched index.css");
