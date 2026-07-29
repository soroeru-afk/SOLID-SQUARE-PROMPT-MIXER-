const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update lucide-react import
code = code.replace(
  /import \{ ArrowLeftRight, Undo2, Redo2, ChevronLeft, ChevronRight, Check, Maximize2, Minimize2 \} from 'lucide-react';/,
  "import { ArrowLeftRight, Undo2, Redo2, ChevronLeft, ChevronRight, Check, Maximize, Minimize } from 'lucide-react';"
);

// Replace header button JSX
const oldHeaderButtons = `<div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded px-2 py-1 outline-none mr-2 transition-colors flex items-center justify-center h-[26px]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={() => setSidebarSwapped(s => !s)}
            className="bg-bg-input hover:bg-border-main border border-border-main text-text-dim rounded px-2 py-1 outline-none mr-2 transition-colors flex items-center justify-center"
            title="Swap Sidebars"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>`;

const newHeaderButtons = `<div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main text-text-main rounded transition-colors flex items-center justify-center shrink-0"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setSidebarSwapped(s => !s)}
            className="w-7 h-7 bg-bg-input hover:bg-border-main border border-border-main text-text-main rounded transition-colors flex items-center justify-center shrink-0"
            title="Swap Sidebars"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>`;

code = code.replace(oldHeaderButtons, newHeaderButtons);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched fullscreen icon and button sizing");
