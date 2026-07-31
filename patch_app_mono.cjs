const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[theme, setTheme\] = useState<'dark' \| 'red' \| 'light' \| 'navy' \| 'black'>\(\(\) => \{/,
  "const [theme, setTheme] = useState<'dark' | 'red' | 'light' | 'navy' | 'black' | 'mono'>(() => {"
);

code = code.replace(
  /onClick=\{.*?setTheme\(t => t === 'dark' \? 'black' : t === 'black' \? 'red' : t === 'red' \? 'light' : t === 'light' \? 'navy' : 'dark'\).*?\}/,
  "onClick={() => setTheme(t => t === 'dark' ? 'black' : t === 'black' ? 'red' : t === 'red' ? 'light' : t === 'light' ? 'navy' : t === 'navy' ? 'mono' : 'dark')}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
