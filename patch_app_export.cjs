const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const exportRegex = /const exportData = \{([\s\S]*?)attributeMixerCategories: catsStr \? JSON\.parse\(catsStr\) : undefined\n\s*\};/;
const exportMatch = content.match(exportRegex);

if (exportMatch) {
  const newExport = `const exportData = {${exportMatch[1]}attributeMixerCategories: catsStr ? JSON.parse(catsStr) : undefined,
      uiEditorTabs: localStorage.getItem('ui_editor_tabs') ? JSON.parse(localStorage.getItem('ui_editor_tabs')!) : undefined,
      variationSectionOrder: localStorage.getItem('variation_section_order') ? JSON.parse(localStorage.getItem('variation_section_order')!) : undefined
    };`;
  content = content.replace(exportRegex, newExport);
}

const importRegex = /const mergeMixerData = \(parsed: any\) => \{([\s\S]*?)window\.dispatchEvent\(new Event\('attributeMixerDataImported'\)\);\n\};\n/;
const importMatch = content.match(importRegex);

if (importMatch) {
  const newImport = `const mergeMixerData = (parsed: any) => {${importMatch[1]}
  if (parsed.uiEditorTabs) {
    const incoming = typeof parsed.uiEditorTabs === 'string' ? JSON.parse(parsed.uiEditorTabs) : parsed.uiEditorTabs;
    localStorage.setItem('ui_editor_tabs', JSON.stringify(incoming));
  }
  if (parsed.variationSectionOrder) {
    const incoming = typeof parsed.variationSectionOrder === 'string' ? JSON.parse(parsed.variationSectionOrder) : parsed.variationSectionOrder;
    localStorage.setItem('variation_section_order', JSON.stringify(incoming));
  }
  window.dispatchEvent(new Event('attributeMixerDataImported'));
};
`;
  content = content.replace(importRegex, newImport);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Patched export/import");
