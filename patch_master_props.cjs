const fs = require('fs');
let code = fs.readFileSync('src/components/MasterColumn.tsx', 'utf8');

if (!code.includes('onCopyBulkToPartDirect?:')) {
  code = code.replace(
    /onCopyBulkToPart\?: \(items: MasterPrompt\[\]\) => void;/,
    "onCopyBulkToPart?: (items: MasterPrompt[]) => void;\n  onCopyBulkToPartDirect?: (items: MasterPrompt[], category: string, section: number) => void;\n  uniqueCategories?: [string, number][];"
  );
  code = code.replace(
    /onCopyBulkToPart, activeTab, setActiveTab, lang, theme/,
    "onCopyBulkToPart, onCopyBulkToPartDirect, uniqueCategories, activeTab, setActiveTab, lang, theme"
  );
}

// Now add the select dropdown in the bulk actions bar
code = code.replace(
  /\{onCopyBulkToPart && \([\s\S]*?COPY[\s\S]*?<\/button>\s*\)\}/,
  `{onCopyBulkToPart && (
                <div className="flex items-center gap-1">
                  <select 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const itemsToCopy = currentList.filter(item => bulkSelectedIds.has(item.id));
                      
                      if (val === 'default') {
                        onCopyBulkToPart(itemsToCopy);
                      } else {
                        const [sectionStr, ...catParts] = val.split(':');
                        const category = catParts.join(':');
                        const section = Number(sectionStr);
                        if (onCopyBulkToPartDirect) {
                          onCopyBulkToPartDirect(itemsToCopy, category, section);
                        }
                      }
                      setBulkSelectedIds(new Set());
                      e.target.value = '';
                    }}
                    value=""
                    className="bg-transparent border border-green-500/50 text-green-500 hover:bg-green-500/10 text-[10px] font-mono px-2 py-1 rounded outline-none transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Copy to Parts...</option>
                    <option value="default">{t('save_as_part', lang)}...</option>
                    {uniqueCategories && uniqueCategories.length > 0 && <option disabled>──────────</option>}
                    {uniqueCategories?.map(([cat, sec]) => (
                      <option key={\`\${sec}:\${cat}\`} value={\`\${sec}:\${cat}\`}>
                        {t(cat as any, lang) || cat} ({t(\`sec_\${sec === 1 ? 'composition' : sec === 2 ? 'pose' : sec === 3 ? 'details' : 'context'}\` as any, lang)})
                      </option>
                    ))}
                  </select>
                </div>
              )}`
);

fs.writeFileSync('src/components/MasterColumn.tsx', code);
console.log("Patched MasterColumn.tsx");
