const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

// 1. Add import
if (!code.includes('AttributeMixer')) {
  code = code.replace("import { Filter, Star, Plus, MoreVertical, Search, Check, Copy, FileText, Pin } from 'lucide-react';", "import { Filter, Star, Plus, MoreVertical, Search, Check, Copy, FileText, Pin } from 'lucide-react';\nimport { AttributeMixer } from './AttributeMixer';");
}

// 2. Add prop type
if (!code.includes('onMixAttributes?:')) {
  code = code.replace("onCopyBulkToMaster?: (items: VariationPart[]) => void;", "onCopyBulkToMaster?: (items: VariationPart[]) => void;\n  onMixAttributes?: (pos: string, neg: string) => void;");
}

// 3. Add prop destructuring
code = code.replace("onCopyBulkToMaster, lang, theme, activeTab = 'parts', setActiveTab, children", "onCopyBulkToMaster, onMixAttributes, lang, theme, activeTab = 'parts', setActiveTab, children");

// 4. Place AttributeMixer under the search bar
const searchBarDiv = `<div className="flex space-x-2 shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('search', lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-input border border-border-main text-[11px] font-mono px-8 py-2 rounded focus:outline-none focus:border-blue-500 text-text-main placeholder-gray-600"
            />
            <span className="absolute left-2.5 top-2.5 opacity-30 font-mono text-[10px] text-text-main">/</span>
          </div>
        </div>`;

const newSearchBarDiv = `<div className="flex space-x-2 shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('search', lang)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-input border border-border-main text-[11px] font-mono px-8 py-2 rounded focus:outline-none focus:border-blue-500 text-text-main placeholder-gray-600"
            />
            <span className="absolute left-2.5 top-2.5 opacity-30 font-mono text-[10px] text-text-main">/</span>
          </div>
        </div>
        
        {/* Attribute Mixer */}
        {onMixAttributes && (
          <div className="shrink-0 flex pt-1">
            <AttributeMixer onApply={onMixAttributes} />
          </div>
        )}`;

code = code.replace(searchBarDiv, newSearchBarDiv);

fs.writeFileSync('src/components/VariationColumn.tsx', code);
console.log("Patched VariationColumn");
