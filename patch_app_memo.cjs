const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const interfaceRegex = /export interface AppData \{/;
const newInterface = `export interface AppData {
  memos?: MasterPrompt[];`;
// Wait, AppData is defined in types.ts. We should modify types.ts instead.
