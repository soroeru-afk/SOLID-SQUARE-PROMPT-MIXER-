const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const handleAddMaster = \(name: string = 'NEW_MASTER', content: string = 'new content'\) => \{/g, 
"const handleAddMaster = (name: string = 'NEW_MASTER', content: string = 'new content', negativeContent?: string) => {");

code = code.replace(/const newMaster: MasterPrompt = \{ id: `m_\$\{Date\.now\(\)\}_\$\{Math\.random\(\)\.toString\(36\)\.substr\(2, 9\)\}`, name, content \};/g,
"const newMaster: MasterPrompt = { id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name, content, negativeContent };");

code = code.replace(/const handleSaveAsMaster = \(name: string, content: string, isNegative: boolean\) => \{/g,
"const handleSaveAsMaster = (name: string, content: string, isNegative: boolean, negativeContent?: string) => {");

code = code.replace(/handleAddMaster\(name, content\);/g, "handleAddMaster(name, content, negativeContent);");

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for save set");
