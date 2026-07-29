const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Patch SaveMasterModal
code = code.replace(
  /<SaveMasterModal\n\s*isOpen=\{isSaveMasterModalOpen\}\n\s*content=\{saveMasterContent\}\n\s*negativeContent=\{saveMasterNegativeContent\}\n\s*defaultTitle=\{saveMasterDefaultTitle\}\n\s*items=\{saveMasterItems\}\n\s*isNegative=\{saveMasterIsNegative\}\n\s*onConfirm=\{\(title, content, isNegative, items, negativeContent\) => \{/g,
  `<SaveMasterModal
        isOpen={isSaveMasterModalOpen}
        content={saveMasterContent}
        negativeContent={saveMasterNegativeContent}
        defaultTitle={saveMasterDefaultTitle}
        items={saveMasterItems}
        isNegative={saveMasterIsNegative}
        selectedId={saveMasterIsNegative ? selectedNegativeId : selectedMasterId}
        selectedName={saveMasterIsNegative ? selectedNegativeName : selectedMasterName}
        onConfirm={(title, content, isNegative, items, negativeContent, isUpdate) => {`
);

code = code.replace(
  /onSaveAsMaster\(item\.name, item\.content, isNegative\);\n\s*\}\);\n\s*\} else \{\n\s*onSaveAsMaster\(title, content, isNegative, negativeContent\);\n\s*\}/g,
  `onSaveAsMaster(item.name, item.content, isNegative, undefined, isUpdate);
              });
            } else {
              onSaveAsMaster(title, content, isNegative, negativeContent, isUpdate);
            }`
);

// Patch SavePartModal
code = code.replace(
  /<SavePartModal\n\s*isOpen=\{isSavePartModalOpen\}\n\s*content=\{savePartContent\}\n\s*defaultName=\{savePartDefaultName\}\n\s*items=\{savePartItems\}\n\s*categories=\{uniqueCategories\}\n\s*onConfirm=\{\(name, category, section, items\) => \{/g,
  `<SavePartModal
        isOpen={isSavePartModalOpen}
        content={savePartContent}
        defaultName={savePartDefaultName}
        items={savePartItems}
        categories={uniqueCategories}
        selectedId={selectedPartId}
        selectedName={selectedPartName}
        onConfirm={(name, category, section, items, isUpdate) => {`
);

code = code.replace(
  /onSaveAsPart\(item\.name, item\.content, category, section\);\n\s*\}\);\n\s*\} else \{\n\s*onSaveAsPart\(name, content, category, section\);\n\s*\}/g,
  `onSaveAsPart(item.name, item.content, category, section, undefined, isUpdate);
              });
            } else {
              onSaveAsPart(name, content, category, section, undefined, isUpdate);
            }`
);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Patched PreviewColumn modals");
