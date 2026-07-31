const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// 1. Remove the old AnimatePresence block
const toastBlockRegex = /\s*<AnimatePresence>\s*\{copied && \(\s*<motion\.div\s*initial=\{\{ opacity: 0, y: -20, scale: 0\.9 \}\}\s*animate=\{\{ opacity: 1, y: 0, scale: 1 \}\}\s*exit=\{\{ opacity: 0, y: -10, scale: 0\.9 \}\}\s*className="absolute top-16 right-4 bg-bg-surface text-text-main px-4 py-2 rounded shadow-lg text-\[10px\] font-mono font-bold flex items-center gap-2 border border-border-main"\s*>\s*\{t\('copied', lang\)\}\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/;

code = code.replace(toastBlockRegex, '');

// 2. Insert into the positive text area wrapper
const insertTarget = /<div className="flex-1 relative flex flex-col mt-1">/;
const newToastBlock = `      {/* Toast Notification (Moved to top of text area) */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-4 right-8 z-50 bg-bg-surface text-text-main px-4 py-2 rounded shadow-lg text-[10px] font-mono font-bold flex items-center gap-2 border border-border-main"
          >
            {t('copied', lang)}
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(insertTarget, `<div className="flex-1 relative flex flex-col mt-1">\n${newToastBlock}`);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
console.log("Moved toast to text area");
