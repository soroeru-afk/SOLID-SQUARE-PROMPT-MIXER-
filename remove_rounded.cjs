const fs = require('fs');
const path = require('path');

function removeRounded(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeRounded(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // Remove classes like rounded, rounded-md, rounded-lg, rounded-full, rounded-b-md, rounded-t, etc.
      content = content.replace(/\brounded(-[a-z0-9\[\]\-]+)?\b/g, '');
      // Clean up multiple spaces inside class names
      content = content.replace(/className=(['"])(.*?)\1/g, (match, quote, classes) => {
        const cleaned = classes.replace(/\s+/g, ' ').trim();
        return `className=${quote}${cleaned}${quote}`;
      });
      content = content.replace(/className=\{\`(.*?)\`\}/g, (match, classes) => {
        const cleaned = classes.replace(/  +/g, ' '); 
        return `className={\`${cleaned}\`}`;
      });
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

removeRounded('./src');
