const fs = require('fs');
let code = fs.readFileSync('src/components/MemoColumn.tsx', 'utf8');

// Replace MasterPrompt with MemoItem (or keep using MasterPrompt as the type)
code = code.replace(/MasterColumnProps/g, 'MemoColumnProps');
code = code.replace(/MasterColumn/g, 'MemoColumn');

// Remove negative props and activeTab
code = code.replace(/negatives = \[\], /g, '');
code = code.replace(/selectedNegativeId, /g, '');
code = code.replace(/onSelectNegative, /g, '');
code = code.replace(/onAddNegative, /g, '');
code = code.replace(/onUpdateNegative, /g, '');
code = code.replace(/onDeleteNegative, /g, '');
code = code.replace(/onDeleteBulkNegative, /g, '');
code = code.replace(/onDeleteAllNegative, /g, '');
code = code.replace(/onMoveBulkNegative, /g, '');
code = code.replace(/onReorderNegative, /g, '');
code = code.replace(/activeTab, setActiveTab, /g, '');

code = code.replace(/negatives\?: MasterPrompt\[\];\n/g, '');
code = code.replace(/selectedNegativeId: string \| null;\n/g, '');
code = code.replace(/onSelectNegative: \(id: string \| null\) => void;\n/g, '');
code = code.replace(/onAddNegative: \(name: string, content: string\) => void;\n/g, '');
code = code.replace(/onUpdateNegative: \(id: string, updates: Partial<MasterPrompt>\) => void;\n/g, '');
code = code.replace(/onDeleteNegative: \(id: string\) => void;\n/g, '');
code = code.replace(/onDeleteBulkNegative: \(ids: Set<string>\) => void;\n/g, '');
code = code.replace(/onDeleteAllNegative: \(\) => void;\n/g, '');
code = code.replace(/onMoveBulkNegative: \(ids: Set<string>, targetId: string\) => void;\n/g, '');
code = code.replace(/onReorderNegative: \(draggedId: string, targetId: string\) => void;\n/g, '');
code = code.replace(/activeTab: 'master' \| 'negative';\n/g, '');
code = code.replace(/setActiveTab: \(tab: 'master' \| 'negative'\) => void;\n/g, '');

// Strip out currentList logic
code = code.replace(/const currentList = activeTab === 'master' \? masters : negatives;/g, "const currentList = masters;");
code = code.replace(/const currentSelectedId = activeTab === 'master' \? selectedId : selectedNegativeId;/g, "const currentSelectedId = selectedId;");
code = code.replace(/const currentOnSelect = activeTab === 'master' \? onSelect : onSelectNegative;/g, "const currentOnSelect = onSelect;");
code = code.replace(/const currentOnAdd = activeTab === 'master' \? onAdd : onAddNegative;/g, "const currentOnAdd = onAdd;");
code = code.replace(/const currentOnUpdate = activeTab === 'master' \? onUpdate : onUpdateNegative;/g, "const currentOnUpdate = onUpdate;");
code = code.replace(/const currentOnDelete = activeTab === 'master' \? onDelete : onDeleteNegative;/g, "const currentOnDelete = onDelete;");
code = code.replace(/const currentOnDeleteBulk = activeTab === 'master' \? onDeleteBulk : onDeleteBulkNegative;/g, "const currentOnDeleteBulk = onDeleteBulk;");
code = code.replace(/const currentOnDeleteAll = activeTab === 'master' \? onDeleteAll : onDeleteAllNegative;/g, "const currentOnDeleteAll = onDeleteAll;");
code = code.replace(/const currentOnMoveBulk = activeTab === 'master' \? onMoveBulk : onMoveBulkNegative;/g, "const currentOnMoveBulk = onMoveBulk;");
code = code.replace(/const currentOnReorder = activeTab === 'master' \? onReorder : onReorderNegative;/g, "const currentOnReorder = onReorder;");

// Replace master specific language strings
code = code.replace(/\{t\('add_master_prompt', lang\)\}/g, "{t('add_memo', lang)}");
code = code.replace(/placeholder=\{t\('new_master_title', lang\)\}/g, "placeholder={t('new_memo_title', lang)}");
code = code.replace(/placeholder=\{t\('new_master_content', lang\)\}/g, "placeholder={t('new_memo_content', lang)}");
code = code.replace(/\{t\('copy_to_variation', lang\)\}/g, "{t('copy_to_variation', lang)}"); // Keep this? Yes, or maybe don't have it. Let's keep it.

fs.writeFileSync('src/components/MemoColumn.tsx', code);
