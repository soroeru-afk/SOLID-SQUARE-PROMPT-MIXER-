const fs = require('fs');

let content = fs.readFileSync('src/components/AttributeMixer.tsx', 'utf8');

// 1. Remove targetText
content = content.replace(/const \[targetText, setTargetText\] = useState\(''\);/, '');
content = content.replace(/onApply\(pos, negativePrompt \+ \(negativePrompt && neg \? ', ' : ''\) \+ neg, targetText\);/, 'onApply(pos, negativePrompt + (negativePrompt && neg ? \', \' : \'\') + neg, \'\');');
content = content.replace(/setTargetText\(''\);/, '');

const targetBlockRegex = /<div className="flex flex-col gap-1\.5 border-b border-border-main pb-3 mb-1 mt-2">\s*<label className="text-\[13px\] font-bold text-text-main font-mono">🔍 置換対象のキーワード \(手動\)<\/label>\s*<input\s*type="text"\s*placeholder="例: japanese girl \(空なら先頭挿入\)"\s*value=\{targetText\}\s*onChange=\{e => setTargetText\(e\.target\.value\)\}\s*className="bg-bg-input border border-border-main rounded px-2 py-1\.5 text-\[13px\] text-text-main placeholder-text-dim"\s*\/>\s*<span className="text-\[11px\] text-text-dim font-mono leading-tight mt-1">\s*※上の窓に入力した文字を、以下の選択内容で全て上書き置換します。\s*<\/span>\s*<\/div>/m;
content = content.replace(targetBlockRegex, '');

// 2. Add border to category container
const catDivRegex = /className=\{\`flex flex-col gap-1\.5 p-1 rounded transition-colors \$\{draggedCatId === key \? 'opacity-50' : 'hover:bg-bg-panel\/50'\}\`\}/;
content = content.replace(catDivRegex, 'className={`flex flex-col gap-1.5 p-2 rounded border border-border-main bg-bg-surface transition-colors ${draggedCatId === key ? \'opacity-50\' : \'hover:bg-bg-panel/30\'}`}');

// 3. Update race presets
content = content.replace(/'日本人 \/ Japanese 🌟', value: '1japanese girl, '/, "'日本人 / Japanese 🌟', value: '1japanese woman, '");
content = content.replace(/'ロシア人 \/ Russian 🌟', value: '1russian girl, white skin, '/, "'ロシア人 / Russian 🌟', value: '1russian woman, white skin, '");
content = content.replace(/'イギリス人 \/ British', value: '1british girl, '/, "'イギリス人 / British', value: '1british woman, '");
content = content.replace(/'アメリカ人 \/ American', value: '1american girl, '/, "'アメリカ人 / American', value: '1american woman, '");
content = content.replace(/'ドイツ人 \/ German', value: '1german girl, '/, "'ドイツ人 / German', value: '1german woman, '");
content = content.replace(/'白人 \/ Caucasian', value: '1caucasian girl, '/, "'白人 / Caucasian', value: '1caucasian woman, '");
content = content.replace(/'黒人 \/ Black', value: '1dark skin girl, '/, "'黒人 / Black', value: '1dark skin woman, '");
content = content.replace(/'ラテン系 \/ Latina', value: '1latina girl, '/, "'ラテン系 / Latina', value: '1latina woman, '");

// Also add a migration in the presets initialization to replace "girl" with "woman" in race presets
const initPresetsRegex = /const \[presets, setPresets\] = useState<Presets>\(\(\) => \{\n\s*const saved = localStorage\.getItem\('attribute_mixer_custom_presets_v6'\);/m;
const newInitPresets = `const [presets, setPresets] = useState<Presets>(() => {
    const saved = localStorage.getItem('attribute_mixer_custom_presets_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.race) {
          parsed.race = parsed.race.map(r => ({
            ...r,
            value: r.value.replace(/girl/g, 'woman')
          }));
        }
        return { ...DEFAULT_PRESETS, ...parsed, location: parsed.location || DEFAULT_PRESETS.location };
      } catch (e) {}
    }
    const saved_v7 = localStorage.getItem('attribute_mixer_custom_presets_v7');
    if (saved_v7) {
        try {
          const parsed = JSON.parse(saved_v7);
          return { ...DEFAULT_PRESETS, ...parsed };
        } catch (e) {}
    }
    const saved_v6 = localStorage.getItem('attribute_mixer_custom_presets_v6');`;

content = content.replace(/const saved = localStorage\.getItem\('attribute_mixer_custom_presets_v6'\);/, `const saved = localStorage.getItem('attribute_mixer_custom_presets_v7') || localStorage.getItem('attribute_mixer_custom_presets_v6');`);

content = content.replace(/localStorage\.setItem\('attribute_mixer_custom_presets_v6', JSON\.stringify\(presets\)\);/, `localStorage.setItem('attribute_mixer_custom_presets_v7', JSON.stringify(presets));`);

// Also apply migration to parsed data
content = content.replace(/const parsed = JSON\.parse\(saved\);/, `const parsed = JSON.parse(saved);
        if (parsed.race) {
          parsed.race = parsed.race.map(r => ({ ...r, value: r.value.replace(/1(japanese|russian|british|american|german|caucasian|dark skin|latina) girl/g, '1$1 woman') }));
        }`);


fs.writeFileSync('src/components/AttributeMixer.tsx', content);
