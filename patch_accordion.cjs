const fs = require('fs');
let code = fs.readFileSync('src/components/Accordion.tsx', 'utf8');

code = code.replace(/  onDelete\?: \(\) => void;\n/g, '  onDelete?: () => void;\n  onEditStart?: () => void;\n  onEditEnd?: () => void;\n');
code = code.replace(/export const Accordion: React.FC<AccordionProps> = \({ title, badge, defaultOpen = false, onAdd, onEdit, onDelete, expandId, collapseId, children }\) => {\n/g, 'export const Accordion: React.FC<AccordionProps> = ({ title, badge, defaultOpen = false, onAdd, onEdit, onDelete, onEditStart, onEditEnd, expandId, collapseId, children }) => {\n');

code = code.replace(/onClick={\(e\) => { e.stopPropagation\(\); setIsEditing\(true\); setEditTitle\(title\); }}/g, 'onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditTitle(title); onEditStart?.(); }}');

code = code.replace(/setIsEditing\(false\);\n/g, 'setIsEditing(false);\n                    onEditEnd?.();\n');

fs.writeFileSync('src/components/Accordion.tsx', code);
