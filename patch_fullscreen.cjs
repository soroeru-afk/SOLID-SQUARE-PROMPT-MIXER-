const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update import
code = code.replace(
  /import \{ ArrowLeftRight, Undo2, Redo2, ChevronLeft, ChevronRight, Check \} from 'lucide-react';/,
  "import { ArrowLeftRight, Undo2, Redo2, ChevronLeft, ChevronRight, Check, Maximize2, Minimize2 } from 'lucide-react';"
);

// 2. Add state & useEffect for fullscreen
const stateToAdd = `  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
`;

code = code.replace(
  /const \[autoOptimize, setAutoOptimize\] = useState<boolean>/,
  stateToAdd + "\n  const [autoOptimize, setAutoOptimize] = useState<boolean>"
);

// 3. Add button in header
const buttonToAdd = `<button 
            onClick={toggleFullscreen}
            className="bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded px-2 py-1 outline-none mr-2 transition-colors flex items-center justify-center h-[26px]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          `;

code = code.replace(
  /<button \n\s*onClick=\{\(\) => setSidebarSwapped\(s => !s\)\}/,
  buttonToAdd + "<button \n            onClick={() => setSidebarSwapped(s => !s)}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched fullscreen functionality");
