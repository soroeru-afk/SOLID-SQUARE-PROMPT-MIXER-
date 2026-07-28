const regex = /<button onClick=\{\(\) => setExpandId\(prev => prev \+ 1\)\}[\s\S]*?<\/button>/m;
const code = `
        <div className="flex gap-2">
          <button onClick={() => setExpandId(prev => prev + 1)} className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded transition-colors whitespace-nowrap">{t('expand_all', lang)}</button>
          <button onClick={() => setCollapseId(prev => prev + 1)} className="px-2 py-1 bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded transition-colors whitespace-nowrap">{t('collapse_all', lang)}</button>
        </div>
`;
console.log(code.match(regex));
