const p1 = { section: 1, category: "人種 (Race)", content: "1british woman" };
const p2 = { section: 1, category: "人種 (Race)", content: "1british woman" };

const normTags1 = p1.content.toLowerCase().split(/[,、\n]+/).map(s => s.trim().replace(/[\s　]+/g, ' ')).filter(Boolean).join(',');
const normCat1 = p1.category.trim().toLowerCase();
const key1 = `${p1.section}|${normCat1}|${normTags1}`;

const normTags2 = p2.content.toLowerCase().split(/[,、\n]+/).map(s => s.trim().replace(/[\s　]+/g, ' ')).filter(Boolean).join(',');
const normCat2 = p2.category.trim().toLowerCase();
const key2 = `${p2.section}|${normCat2}|${normTags2}`;

console.log({key1, key2});
