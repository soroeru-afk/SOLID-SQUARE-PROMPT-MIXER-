const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const modalStr = `      <ImportModal
        isOpen={importPendingData !== null}
        onMerge={() => executeImport(true)}
        onOverwrite={() => executeImport(false)}
        onCancel={() => setImportPendingData(null)}
        lang={lang}
      />
    </div>
  );
}`;

content = content.replace(/    <\/div>\s*\)\;\s*\}\s*$/, modalStr);

fs.writeFileSync('src/App.tsx', content);
console.log('Added ImportModal to JSX');
