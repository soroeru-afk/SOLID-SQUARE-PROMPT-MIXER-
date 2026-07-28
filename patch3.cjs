const fs = require('fs');
let code = fs.readFileSync('src/components/VariationColumn.tsx', 'utf8');

const replacement = `
                        <div 
                          key={category}
                          draggable
                          onDragStart={(e) => handleCatDragStart(e, category, Number(secId))}
                          onDragEnd={handleCatDragEnd}
                          onDragOver={(e) => handleCatDragOver(e, Number(secId))}
                          onDrop={(e) => handleCatDrop(e, category, Number(secId))}
                        >
                        <Accordion 
`;

code = code.replace(/                        <Accordion \n/, replacement);
code = code.replace(/                        <\/Accordion>\n/g, '                        </Accordion>\n                        </div>\n');

fs.writeFileSync('src/components/VariationColumn.tsx', code);
