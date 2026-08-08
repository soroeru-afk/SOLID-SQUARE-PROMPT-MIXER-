const text = "(steamy bathroom background, :1.5)";
const cleaned = text.replace(/,\s*(:\d+(\.\d+)?\))/g, '$1');
console.log(cleaned);
