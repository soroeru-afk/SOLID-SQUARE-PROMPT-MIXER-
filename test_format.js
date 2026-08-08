const text1 = "photography, realistic, 8K, smile, large, pubic hair,";
const text2 = "photography,\nrealistic,\n8K";

const format = (text) => {
  const isVertical = (text.match(/\n/g) || []).length > 0;
  const items = text.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
  
  if (isVertical) {
    return items.join(', ') + (text.trim().endsWith(',') ? ',' : '');
  } else {
    return items.join(',\n') + (text.trim().endsWith(',') ? ',' : '');
  }
};

console.log("text1 to vertical:\n" + format(text1));
console.log("text2 to horizontal:\n" + format(text2));
