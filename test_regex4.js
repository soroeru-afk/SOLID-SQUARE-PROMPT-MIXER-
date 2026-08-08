let text = "1girl (steamy bathroom:1.5), test [tag]";
let text2 = "1girl(steamy bathroom:1.5)test";
text = text.replace(/([^,\[(\s])\s*(\(|\[)/g, '$1, $2');
text2 = text2.replace(/([^,\[(\s])\s*(\(|\[)/g, '$1, $2');
console.log(text);
console.log(text2);
