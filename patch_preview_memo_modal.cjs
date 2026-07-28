const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewColumn.tsx', 'utf8');

// Add props
code = code.replace(/onSaveAsMemo\?: \(name: string, content: string\) => void;\n/, "onSaveAsMemo?: (name: string, content: string, isUpdate: boolean) => void;\n  selectedMemoId?: string | null;\n  selectedMemoName?: string;\n");
code = code.replace(/onSaveAsMemo,\n/, "onSaveAsMemo,\n  selectedMemoId,\n  selectedMemoName,\n");

// Add import
code = code.replace(/import \{ SaveMasterModal \} from '\.\/SaveMasterModal';/, "import { SaveMasterModal } from './SaveMasterModal';\nimport { SaveMemoModal } from './SaveMemoModal';");

// Add state
const stateInsertion = `  const [isSaveMasterModalOpen, setIsSaveMasterModalOpen] = useState(false);
  const [isSaveMemoModalOpen, setIsSaveMemoModalOpen] = useState(false);
  const [saveMemoContent, setSaveMemoContent] = useState('');
  const [saveMemoDefaultTitle, setSaveMemoDefaultTitle] = useState('');`;
code = code.replace(/const \[isSaveMasterModalOpen, setIsSaveMasterModalOpen\] = useState\(false\);/, stateInsertion);

// Update positive button onClick
const posClick = /onClick=\{\(\) => \{\n\s*if \(onSaveAsMemo\) \{\n\s*const text = editorText\.trim\(\);\n\s*if \(\!text\) return;\n\s*const firstLine = text\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*onSaveAsMemo\(title, text\);\n\s*\}\n\s*\}\}/;
const posNewClick = `onClick={() => {
                  const text = editorText.trim();
                  if (!text) return;
                  const firstLine = text.split('\\n')[0];
                  const title = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine;
                  setSaveMemoContent(text);
                  setSaveMemoDefaultTitle(title);
                  setIsSaveMemoModalOpen(true);
                }}`;
code = code.replace(posClick, posNewClick);

// Update negative button onClick
const negClick = /onClick=\{\(\) => \{\n\s*if \(onSaveAsMemo\) \{\n\s*const text = negativeEditorText\.trim\(\);\n\s*if \(\!text\) return;\n\s*const firstLine = text\.split\('\\n'\)\[0\];\n\s*const title = firstLine\.length > 20 \? firstLine\.slice\(0, 20\) \+ '\.\.\.' : firstLine;\n\s*onSaveAsMemo\(title, text\);\n\s*\}\n\s*\}\}/;
const negNewClick = `onClick={() => {
                  const text = negativeEditorText.trim();
                  if (!text) return;
                  const firstLine = text.split('\\n')[0];
                  const title = firstLine.length > 20 ? firstLine.slice(0, 20) + '...' : firstLine;
                  setSaveMemoContent(text);
                  setSaveMemoDefaultTitle(title);
                  setIsSaveMemoModalOpen(true);
                }}`;
code = code.replace(negClick, negNewClick);

// Add SaveMemoModal component near the bottom
const modalsInsertion = `      <SaveMemoModal
        isOpen={isSaveMemoModalOpen}
        content={saveMemoContent}
        defaultTitle={saveMemoDefaultTitle}
        selectedMemoId={selectedMemoId || null}
        selectedMemoName={selectedMemoName || ''}
        onConfirm={(title, content, isUpdate) => {
          if (onSaveAsMemo) {
            onSaveAsMemo(title, content, isUpdate);
          }
          setIsSaveMemoModalOpen(false);
        }}
        onCancel={() => setIsSaveMemoModalOpen(false)}
        lang={lang}
      />
      <SaveMasterModal`;
code = code.replace(/<SaveMasterModal/, modalsInsertion);

fs.writeFileSync('src/components/PreviewColumn.tsx', code);
