const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('memos?: MasterPrompt[];')) {
  const appDataRegex = /export interface AppData \{/;
  code = code.replace(appDataRegex, "export interface AppData {\n  memos?: MasterPrompt[];");
  fs.writeFileSync('src/types.ts', code);
}
