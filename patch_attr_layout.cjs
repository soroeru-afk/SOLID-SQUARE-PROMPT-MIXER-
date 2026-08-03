const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

const moveRegex = /const moveCategory = \(key: string, direction: 'up' \| 'down' \| 'top' \| 'bottom'\) => \{\n\s*setCategories\(prev => \{\n\s*const idx = prev\.findIndex\(c => c\.id === key\);\n\s*if \(idx === -1\) return prev;\n\n\s*const item = prev\[idx\];\n\s*const next = \[\.\.\.prev\];\n\s*if \(direction === 'up' && idx > 0\) \{\n\s*\[next\[idx - 1\], next\[idx\]\] = \[next\[idx\], next\[idx - 1\]\];\n\s*\} else if \(direction === 'down' && idx < next\.length - 1\) \{\n\s*\[next\[idx \+ 1\], next\[idx\]\] = \[next\[idx\], next\[idx \+ 1\]\];\n\s*\} else if \(direction === 'top'\) \{\n\s*next\.splice\(idx, 1\);\n\s*next\.unshift\(item\);\n\s*\} else if \(direction === 'bottom'\) \{\n\s*next\.splice\(idx, 1\);\n\s*next\.push\(item\);\n\s*\}\n\s*return next;\n\s*\}\);\n\s*\};/m;

const newMove = `const moveCategory = (key: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === key);
      if (idx === -1) return prev;
      
      const item = prev[idx];
      const sameTypeItems = prev.filter(c => !!c.isNegative === !!item.isNegative);
      const otherItems = prev.filter(c => !!c.isNegative !== !!item.isNegative);
      
      let sameIdx = sameTypeItems.findIndex(c => c.id === key);
      
      const next = [...sameTypeItems];
      if (direction === 'up' && sameIdx > 0) {
        [next[sameIdx - 1], next[sameIdx]] = [next[sameIdx], next[sameIdx - 1]];
      } else if (direction === 'down' && sameIdx < next.length - 1) {
        [next[sameIdx + 1], next[sameIdx]] = [next[sameIdx], next[sameIdx + 1]];
      } else if (direction === 'top') {
        next.splice(sameIdx, 1);
        next.unshift(item);
      } else if (direction === 'bottom') {
        next.splice(sameIdx, 1);
        next.push(item);
      }
      
      return item.isNegative ? [...otherItems, ...next] : [...next, ...otherItems];
    });
  };`;

content = content.replace(moveRegex, newMove);

const dropRegex = /const handleDrop = \(e: React\.DragEvent, targetId: string\) => \{\n\s*e\.preventDefault\(\);\n\s*if \(\!draggedCatId \|\| draggedCatId === targetId\) return;\n\s*setCategories\(prev => \{\n\s*const draggedIdx = prev\.findIndex\(c => c\.id === draggedCatId\);\n\s*const targetIdx = prev\.findIndex\(c => c\.id === targetId\);\n\s*if \(draggedIdx === -1 \|\| targetIdx === -1\) return prev;\n\s*const newCats = \[\.\.\.prev\];\n\s*const \[item\] = newCats\.splice\(draggedIdx, 1\);\n\s*newCats\.splice\(targetIdx, 0, item\);\n\s*return newCats;\n\s*\}\);\n\s*setDraggedCatId\(null\);\n\s*\};/m;

const newDrop = `const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedCatId || draggedCatId === targetId) return;
    setCategories(prev => {
      const draggedIdx = prev.findIndex(c => c.id === draggedCatId);
      const targetIdx = prev.findIndex(c => c.id === targetId);
      if (draggedIdx === -1 || targetIdx === -1) return prev;
      if (!!prev[draggedIdx].isNegative !== !!prev[targetIdx].isNegative) return prev;
      const newCats = [...prev];
      const [item] = newCats.splice(draggedIdx, 1);
      newCats.splice(targetIdx, 0, item);
      return newCats;
    });
    setDraggedCatId(null);
  };`;

content = content.replace(dropRegex, newDrop);

const renderListRegex = /<div className="flex flex-col gap-2">\s*\{categories\.map\(\(c, i\) => renderCategory\(c, i\)\)\}\s*<\/div>\s*<div className="flex gap-2 justify-end mt-2">\s*<button\s*onClick=\{\(\) => \{\s*const id = 'custom_' \+ Date\.now\(\);\s*setCategories\(prev => \[\.\.\.prev, \{ id, label: '新規カテゴリ' \}\]\);\s*setPresets\(prev => \(\{ \.\.\.prev, \[id\]: \[\{ label: '指定なし \/ None', value: '' \}\] \}\)\);\s*\}\}\s*className="px-2 py-1 bg-bg-surface hover:bg-bg-input border border-border-main rounded text-\[11px\] font-bold flex items-center gap-1 transition-colors text-text-main"\s*>\s*<Plus className="w-3 h-3" \/> カテゴリ追加\s*<\/button>\s*<\/div>\s*<div className="flex flex-col gap-1\.5 pt-2 border-t border-border-main mt-2">\s*<label className="text-\[13px\] font-bold text-text-main font-mono">⛔ ネガティブプロンプト \(自由入力\)<\/label>\s*<textarea\s*value=\{negativePrompt\}\s*onChange=\{e => setNegativePrompt\(e\.target\.value\)\}\s*placeholder="ネガティブプロンプトを追加\.\.\."\s*className="w-full bg-bg-input border border-border-main rounded px-2 py-1\.5 text-\[13px\] text-text-main font-mono min-h-\[60px\] resize-y"\s*\/>\s*<button\s*onClick=\{\(\) => \{\s*const id = 'custom_neg_' \+ Date\.now\(\);\s*setCategories\(prev => \[\.\.\.prev, \{ id, label: '新規ネガティブ', isNegative: true \}\]\);\s*setPresets\(prev => \(\{ \.\.\.prev, \[id\]: \[\{ label: '指定なし \/ None', value: '' \}\] \}\)\);\s*\}\}\s*className="px-2 py-1 bg-red-500\/10 hover:bg-red-500\/20 border border-red-500\/30 rounded text-\[11px\] font-bold flex items-center gap-1 transition-colors text-red-400 self-end"\s*>\s*<Plus className="w-3 h-3" \/> ネガティブ追加\s*<\/button>\s*<\/div>/m;

const newRenderList = `<div className="flex flex-col gap-2">
        {categories.map((c, i) => !c.isNegative && renderCategory(c, i))}
      </div>
      
      <div className="flex gap-2 justify-end mt-2">
        <button
          onClick={() => {
            const id = 'custom_' + Date.now();
            setCategories(prev => [...prev, { id, label: '新規カテゴリ' }]);
            setPresets(prev => ({ ...prev, [id]: [{ label: '指定なし / None', value: '' }] }));
          }}
          className="px-2 py-1 bg-bg-surface hover:bg-bg-input border border-border-main rounded text-[11px] font-bold flex items-center gap-1 transition-colors text-text-main"
        >
          <Plus className="w-3 h-3" /> カテゴリ追加
        </button>
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-border-main mt-2">
        <div className="flex flex-col gap-2 mb-2">
          {categories.map((c, i) => c.isNegative && renderCategory(c, i))}
        </div>
        <label className="text-[13px] font-bold text-text-main font-mono mt-2">⛔ ネガティブプロンプト (自由入力)</label>
        <textarea 
          value={negativePrompt}
          onChange={e => setNegativePrompt(e.target.value)}
          placeholder="ネガティブプロンプトを追加..."
          className="w-full bg-bg-input border border-border-main rounded px-2 py-1.5 text-[13px] text-text-main font-mono min-h-[60px] resize-y"
        />
        <button
          onClick={() => {
            const id = 'custom_neg_' + Date.now();
            setCategories(prev => [...prev, { id, label: '新規ネガティブ', isNegative: true }]);
            setPresets(prev => ({ ...prev, [id]: [{ label: '指定なし / None', value: '' }] }));
          }}
          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-[11px] font-bold flex items-center gap-1 transition-colors text-red-400 self-end mt-1"
        >
          <Plus className="w-3 h-3" /> ネガティブ追加
        </button>
      </div>`;

content = content.replace(renderListRegex, newRenderList);

fs.writeFileSync('src/components/AttributeMixer.tsx', content);
