const fs = require('fs');
let content = fs.readFileSync('src/components/ImportModal.tsx', 'utf8');

content = content.replace(
  /: 'インポート方法を選択してください。\\\\n\\\\n【マージ（結合）】現在のデータを残したまま、新しいデータを追加します。\\\\n\\\\n【上書き】現在のデータをすべて消去し、インポートするデータで完全に置き換えます。'}/,
  `: 'インポート方法を選択してください。\\n\\n【マージ（結合）】現在のデータを残したまま、新しいデータを追加します。\\n\\n【上書き】現在のデータをすべて消去し、インポートするデータで完全に置き換えます。'}`
);
content = content.replace(/className="text-text-main text-sm font-mono mb-6"/, 'className="text-text-main text-sm font-mono mb-6 whitespace-pre-wrap"');

fs.writeFileSync('src/components/ImportModal.tsx', content);
