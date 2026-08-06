const fs = require('fs');
let content = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

const replacement = `<span className="text-[10px] font-mono text-text-main opacity-50 ml-2">{t('font_weight', lang as Language)}:</span>
        <div className="flex items-center space-x-1 ml-1">
          <select 
            value={editorFontWeight}
            onChange={e => setEditorFontWeight(e.target.value)}
            className={\`border border-border-main text-[10px] font-mono rounded px-1 py-1 outline-none cursor-pointer uppercase tracking-wider transition-colors shrink-0 \${theme === 'mono' ? 'bg-bg-input text-text-main hover:bg-gray-500 hover:text-white' : 'bg-bg-input text-text-main hover:bg-border-main'}\`}
          >
            <option value="400">{t('font_normal', lang as Language)}</option>
            <option value="700">{t('font_bold', lang as Language)}</option>
          </select>`;

content = content.replace(
  /<div className="flex items-center space-x-1 ml-2">\s*<select\s*value=\{editorFontWeight\}\s*onChange=\{e => setEditorFontWeight\(e\.target\.value\)\}\s*className=\{`border border-border-main text-\[10px\] font-mono rounded px-1 py-1 outline-none cursor-pointer uppercase tracking-wider transition-colors shrink-0 \$\{theme === 'mono' \? 'bg-bg-input text-text-main hover:bg-gray-500 hover:text-white' : 'bg-bg-input text-text-main hover:bg-border-main'\}`\}\s*>\s*<option value="400">Normal<\/option>\s*<option value="700">Bold<\/option>\s*<option value="900">Black<\/option>\s*<\/select>/,
  replacement
);

fs.writeFileSync('src/components/PreviewColumn.tsx', content);
console.log('Fixed font weight options');
