const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Remove double `{isNegativeOpen && (` from positive editor
// It looks like:
//          {isNegativeOpen && (
//          {isNegativeOpen && (
//          <div className="flex-1 relative flex flex-col mt-1">
//            <div 
//              ref={positiveHighlightRef}
code = code.replace(/\{\s*isNegativeOpen && \(\s*\{\s*isNegativeOpen && \(\s*<div className="flex-1 relative flex flex-col mt-1">/g, '<div className="flex-1 relative flex flex-col mt-1">');
code = code.replace(/\{\s*isNegativeOpen && \(\s*<div className="flex-1 relative flex flex-col mt-1">/g, '<div className="flex-1 relative flex flex-col mt-1">');

// 2. Remove double from resizer
//        {isNegativeOpen && (
//        {/* Move/Copy Text Buttons & Resizer */}
//        {isNegativeOpen && (
//        <div className="flex justify-center -my-3 relative z-10">
code = code.replace(/\{\s*isNegativeOpen && \(\s*\{\/\* Move\/Copy Text Buttons & Resizer \*\/\}\s*\{\s*isNegativeOpen && \(\s*<div className="flex justify-center -my-3 relative z-10">/g, '{/* Move/Copy Text Buttons & Resizer */}\n        <div className="flex justify-center -my-3 relative z-10">');
code = code.replace(/\{\s*isNegativeOpen && \(\s*<div className="flex justify-center -my-3 relative z-10">/g, '<div className="flex justify-center -my-3 relative z-10">');

// 3. Let's remove the broken closing brackets too
code = code.replace(/<\/textarea>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Toast Notification \*\/\}/g, '</textarea>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      {/* Toast Notification */}');

// Just remove `isNegativeOpen && (` completely everywhere first
code = code.replace(/\{isNegativeOpen && \(\s*/g, '');
code = code.replace(/\n\s*\)\}\n\s*<\/div>\n\s*<\/div>\n\s*<div \n\s*className=\{`border/g, '\n      </div>\n        <div \n          className={`border');
code = code.replace(/<\/textarea>\s*<\/div>\s*\)\}\s*<\/div>/g, '</textarea>\n            </div>\n          </div>');

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Cleanup done");
