const toggle = (text, toVertical) => {
  if (!text || !text.trim()) return text;
  
  let cleanedText = text.replace(/,\s*(:\d+(\.\d+)?\))/g, '$1');
  cleanedText = cleanedText.replace(/,\s*\)/g, ')');
  cleanedText = cleanedText.replace(/,\s*\]/g, ']');
  
  cleanedText = cleanedText.replace(/(\)|\])\s*([^,\])\s])/g, '$1, $2');
  cleanedText = cleanedText.replace(/([^,\[(\s])\s*(\(|\[)/g, '$1, $2');

  const items = cleanedText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
  
  if (!toVertical) {
    return items.join(', ') + (cleanedText.trim().endsWith(',') ? ',' : '');
  } else {
    return items.join(',\n') + (cleanedText.trim().endsWith(',') ? ',' : '');
  }
};

const pos = "1girl (steamy bathroom background, :1.5)holding a shower";
const neg = "lowres, bad anatomy";
const isCurrentlyVertical = pos && pos.includes('\n');
const toVertical = !isCurrentlyVertical;

console.log("POS:\n" + toggle(pos, toVertical));
console.log("NEG:\n" + toggle(neg, toVertical));
