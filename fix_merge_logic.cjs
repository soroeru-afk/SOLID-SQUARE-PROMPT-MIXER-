const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const newMergeLogic = `const mergeMixerData = (parsed: any) => {
  // Categories
  if (parsed.attributeMixerCategories) {
    const incomingCats = typeof parsed.attributeMixerCategories === 'string' ? JSON.parse(parsed.attributeMixerCategories) : parsed.attributeMixerCategories;
    
    // Get existing
    const existingCatsStr = localStorage.getItem('attribute_mixer_categories_v2') || localStorage.getItem('attribute_mixer_categories_v1') || localStorage.getItem('attribute_mixer_categories');
    let existingCats = [];
    if (existingCatsStr) {
      try { existingCats = JSON.parse(existingCatsStr); } catch(e) {}
    }
    
    // Merge
    const mergedCats = [...existingCats];
    const existingIds = new Set(existingCats.map((c: any) => c.id));
    for (const cat of incomingCats) {
      if (!existingIds.has(cat.id)) {
        mergedCats.push(cat);
        existingIds.add(cat.id);
      }
    }
    
    localStorage.setItem('attribute_mixer_categories_v2', JSON.stringify(mergedCats));
  }
  
  // Presets
  if (parsed.attributeMixerPresets) {
    const incomingPresets = typeof parsed.attributeMixerPresets === 'string' ? JSON.parse(parsed.attributeMixerPresets) : parsed.attributeMixerPresets;
    
    const existingPresetsStr = localStorage.getItem('attribute_mixer_custom_presets_v7') || localStorage.getItem('attribute_mixer_custom_presets_v6') || localStorage.getItem('attribute_mixer_custom_presets_v5') || localStorage.getItem('attribute_mixer_custom_presets_v4') || localStorage.getItem('attribute_mixer_custom_presets_v3') || localStorage.getItem('attribute_mixer_custom_presets_v2') || localStorage.getItem('attribute_mixer_custom_presets_v1') || localStorage.getItem('attribute_mixer_custom_presets');
    let existingPresets: any = {};
    if (existingPresetsStr) {
      try { existingPresets = JSON.parse(existingPresetsStr); } catch(e) {}
    }
    
    const mergedPresets = { ...existingPresets };
    for (const catId in incomingPresets) {
      if (!mergedPresets[catId]) {
        mergedPresets[catId] = incomingPresets[catId];
      } else {
        const existingValues = new Set(mergedPresets[catId].map((i: any) => i.value));
        const newItems = incomingPresets[catId].filter((i: any) => !existingValues.has(i.value));
        mergedPresets[catId] = [...mergedPresets[catId], ...newItems];
      }
    }
    localStorage.setItem('attribute_mixer_custom_presets_v7', JSON.stringify(mergedPresets));
  }

  // Combos
  if (parsed.attributeMixerCombos) {
    const incomingCombos = typeof parsed.attributeMixerCombos === 'string' ? JSON.parse(parsed.attributeMixerCombos) : parsed.attributeMixerCombos;
    
    const existingCombosStr = localStorage.getItem('attribute_mixer_combinations_v1') || localStorage.getItem('attribute_mixer_combinations');
    let existingCombos = [];
    if (existingCombosStr) {
      try { existingCombos = JSON.parse(existingCombosStr); } catch(e) {}
    }
    
    const mergedCombos = [...existingCombos];
    const existingComboIds = new Set(existingCombos.map((c: any) => c.id));
    for (const combo of incomingCombos) {
      if (!existingComboIds.has(combo.id)) {
        mergedCombos.push(combo);
        existingComboIds.add(combo.id);
      }
    }
    localStorage.setItem('attribute_mixer_combinations_v1', JSON.stringify(mergedCombos));
  }
  
  if (parsed.uiEditorTabs) {
    const incomingTabs = typeof parsed.uiEditorTabs === 'string' ? JSON.parse(parsed.uiEditorTabs) : parsed.uiEditorTabs;
    localStorage.setItem('ui_editor_tabs', JSON.stringify(incomingTabs)); // Tabs might be okay to overwrite
  }
  if (parsed.variationSectionOrder) {
    const incomingOrder = typeof parsed.variationSectionOrder === 'string' ? JSON.parse(parsed.variationSectionOrder) : parsed.variationSectionOrder;
    localStorage.setItem('variation_section_order', JSON.stringify(incomingOrder));
  }
  window.dispatchEvent(new Event('attributeMixerDataImported'));
};`;

content = content.replace(/const mergeMixerData = \(\s*parsed: any\s*\) => \{[\s\S]*?window\.dispatchEvent\(new Event\('attributeMixerDataImported'\)\);\s*\};/, newMergeLogic);
fs.writeFileSync('src/App.tsx', content);
console.log('Fixed mergeMixerData');
