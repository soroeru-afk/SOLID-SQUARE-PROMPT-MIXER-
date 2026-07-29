const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const stateRegex = /const \[saveMasterContent, setSaveMasterContent\] = useState\(''\);/;
code = code.replace(stateRegex, "const [saveMasterContent, setSaveMasterContent] = useState('');\n  const [saveMasterNegativeContent, setSaveMasterNegativeContent] = useState<string | undefined>(undefined);");

const modalRegex = /<SaveMasterModal\n\s*isOpen=\{isSaveMasterModalOpen\}\n\s*content=\{saveMasterContent\}\n\s*defaultTitle=\{saveMasterDefaultTitle\}\n\s*items=\{saveMasterItems\}\n\s*isNegative=\{saveMasterIsNegative\}\n\s*onConfirm=\{\(title, content, isNegative, items\) => \{/;
code = code.replace(modalRegex, `<SaveMasterModal
        isOpen={isSaveMasterModalOpen}
        content={saveMasterContent}
        negativeContent={saveMasterNegativeContent}
        defaultTitle={saveMasterDefaultTitle}
        items={saveMasterItems}
        isNegative={saveMasterIsNegative}
        onConfirm={(title, content, isNegative, items) => {`);

const handleSaveMasterClickRegex = /const handleSaveMasterClick = \(isNegativeTextarea: boolean, saveAsNegative\?: boolean\) => \{/;
code = code.replace(handleSaveMasterClickRegex, `const handleSaveSetClick = () => {
    if (!onSaveAsMaster) return;
    const posText = editorText.trim();
    const negText = negativeEditorText.trim();
    if (!posText && !negText) return;
    
    const firstLine = posText ? posText.split('\\n')[0] : negText.split('\\n')[0];
    const title = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine;
    
    setSaveMasterItems(undefined);
    setSaveMasterContent(posText);
    setSaveMasterNegativeContent(negText);
    setSaveMasterDefaultTitle(title);
    setSaveMasterIsNegative(false);
    setIsSaveMasterModalOpen(true);
  };

  const handleSaveMasterClick = (isNegativeTextarea: boolean, saveAsNegative?: boolean) => {
    setSaveMasterNegativeContent(undefined); // Reset for single save`);

const buttonRegex = /<button \n\s*onClick=\{\(\) => handleSaveMasterClick\(false, activeMasterTab === 'negative'\)\}/;
code = code.replace(buttonRegex, `<button 
                onClick={() => handleSaveSetClick()}
                className="flex items-center gap-1 px-2 py-1 bg-accent-main hover:bg-blue-600 border border-accent-dim rounded text-[9px] font-mono text-white transition-colors"
              >
                <Save className="w-3 h-3" /> {t('save_as_set', lang)}
              </button>
              <button 
                onClick={() => handleSaveMasterClick(false, activeMasterTab === 'negative')}`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn.tsx");
