let text = "(steamy bathroom:1.5)holding a shower, [test] another tag, (foo) (bar)";
let text2 = "(tag) 1girl, (tag2)";
text = text.replace(/(\)|\])\s*([^,\])\s])/g, '$1, $2');
text2 = text2.replace(/(\)|\])\s*([^,\])\s])/g, '$1, $2');
console.log(text);
console.log(text2);
