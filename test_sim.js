function getTags(str) {
  return str.toLowerCase().split(/[,、\n]+/).map(s => s.trim()).filter(Boolean);
}
console.log(getTags("イギリス人"));
