let text = "(steamy bathroom background, :1.5), (another, ), [test, ]";
text = text.replace(/,\s*(:\d+(\.\d+)?\))/g, '$1');
text = text.replace(/,\s*\)/g, ')');
text = text.replace(/,\s*\]/g, ']');
console.log(text);
