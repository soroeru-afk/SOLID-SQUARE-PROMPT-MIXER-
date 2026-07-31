const fs = require('fs');
let code = fs.readFileSync('src/components/Accordion.tsx', 'utf8');

code = code.replace(
  /className="bg-slate-500\/80 text-white text-\[10px\] font-bold px-1\.5 py-0\.5 rounded leading-none min-w-\[20px\] text-center shadow-sm"/,
  'className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none min-w-[20px] text-center shadow-sm"'
);

fs.writeFileSync('src/components/Accordion.tsx', code);
console.log("Patched Accordion badge");
