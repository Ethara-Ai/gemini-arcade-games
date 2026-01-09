import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { use1024 } from './use1024';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useKeyPress } from '../../hooks/useKeyboard';
// import { useSwipeable } from 'react-swipeable'; // Need to install if used, or use custom swipe hook

const getTileColor = (value: number) => {
  switch (value) {
    case 2: return 'bg-blue-400 text-gray-900';
    case 4: return 'bg-blue-500 text-white';
    case 8: return 'bg-teal-500 text-white';
    case 16: return 'bg-emerald-500 text-white';
    case 32: return 'bg-green-600 text-white';
    case 64: return 'bg-lime-500 text-gray-900';
    case 128: return 'bg-yellow-400 text-gray-900';
    case 256: return 'bg-orange-400 text-white';
    case 512: return 'bg-orange-600 text-white';
    case 1024: return 'bg-cyan-400 text-gray-900 shadow-[0_0_20px_rgba(34,211,238,0.6)]';
    case 2048: return 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)]';
    default: return 'bg-game-dark text-white';
  }
};

export const Game1024: React.FC = () => {
  const { grid, score, bestScore, gameOver, won, keepPlaying, move, initGame, continueGame } = use1024();

  // Keyboard controls
  useKeyPress('ArrowUp');
  useKeyPress('w');
  useKeyPress('ArrowDown');
  useKeyPress('s');
  useKeyPress('ArrowLeft');
  useKeyPress('a');
  useKeyPress('ArrowRight');
  useKeyPress('d');

  // Simple debounce or just trigger on press?
  // useKeyPress returns true while held. I need "on press" event.
  // The hook returns state. I should use an event listener in the component or a different hook.
  // I'll add event listeners here for simplicity.

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
        case 'w': move('up'); break;
        case 'ArrowDown':
        case 's': move('down'); break;
        case 'ArrowLeft':
        case 'a': move('left'); break;
        case 'ArrowRight':
        case 'd': move('right'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch/Swipe (Basic)
  const [touchStart, setTouchStart] = React.useState<{x:number, y:number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      
      if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.abs(dx) > 30) move(dx > 0 ? 'right' : 'left');
      } else {
          if (Math.abs(dy) > 30) move(dy > 0 ? 'down' : 'up');
      }
      setTouchStart(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden"
         onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      
      <div className="w-full max-w-md mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black text-game-tile mb-2">1024</h1>
          <p className="text-gray-400">Join the numbers to get to 1024!</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel p-3 text-center min-w-[80px]">
            <div className="text-xs text-gray-400 uppercase font-bold">Score</div>
            <div className="text-xl font-bold text-white">{score}</div>
          </div>
          <div className="glass-panel p-3 text-center min-w-[80px]">
            <div className="text-xs text-gray-400 uppercase font-bold">Best</div>
            <div className="text-xl font-bold text-white">{bestScore}</div>
          </div>
        </div>
      </div>

      <div className="relative glass-panel p-4 rounded-xl">
        <div className="grid grid-cols-4 gap-3 bg-black/40 p-3 rounded-lg w-[340px] h-[340px] sm:w-[400px] sm:h-[400px]">
          {/* Background Grid Cells */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-md w-full h-full" />
          ))}
          
          {/* Tiles */}
          <div className="absolute inset-0 p-3 gap-3 grid grid-cols-4 pointer-events-none">
             {grid.flat().map(() => {
               // We need to render tiles in a flat list with keys?
               // Actually the grid is mapped by index.
               // To animate movement, we'd need absolute positioning based on row/col.
               // For this implementation, I'm mapping grid cells.
               // So if tile moves, the old cell becomes null, new cell gets tile.
               // Framer Motion AnimatePresence can handle enter/exit if key changes.
               // Key should be tile.id if tile exists.
               
               // But here I am iterating grid positions.
               // If I just render the non-null tiles, I can use layout animation?
               // No, I need them positioned.
               
               // Workaround: Render tiles as absolute positioned elements on top of the grid.
               return null; 
             })}
          </div>

          {/* Actual Tiles Layer */}
           {grid.map((row, r) => row.map((tile, c) => {
               if (!tile) return null;
               
               return (
                 <motion.div
                   key={tile.id}
                   layoutId={`tile-${tile.id}`}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1, top: `calc(${r * 100 / 4}% + 0px)`, left: `calc(${c * 100 / 4}% + 0px)` }}
                   // The logic above for calculation inside grid cell is easier if absolute
                   className={`absolute w-[calc(25%-0.75rem)] h-[calc(25%-0.75rem)] m-1.5 flex items-center justify-center rounded-md font-bold text-3xl shadow-lg ${getTileColor(tile.value)}`}
                   style={{
                       // Overriding animate valus to be sure? 
                       // motion handles it if we use layout or animate x/y.
                       // But here I'm using Grid CSS + Absolute? 
                       // No, the parent is relative.
                       // Better: Just use absolute positioning for all tiles based on r/c.
                       top: `calc(${r * 25}% + 0.75rem)`,
                       left: `calc(${c * 25}% + 0.75rem)`,
                       width: 'calc(25% - 1.5rem)',
                       height: 'calc(25% - 1.5rem)',
                   }}
                   transition={{ type: "spring", stiffness: 300, damping: 25 }}
                 >
                   {tile.value}
                 </motion.div>
               );
           })).flat()}
        </div>
      </div>

      <div className="mt-8">
        <Button variant="secondary" onClick={initGame}>New Game</Button>
      </div>

      {/* Won Modal */}
      <Modal isOpen={won && !keepPlaying} title="You Win!" onClose={continueGame}>
         <div className="text-center">
            <p className="mb-4 text-gray-300">You reached 1024! Amazing job.</p>
            <div className="flex gap-4">
                <Button onClick={continueGame} variant="secondary" className="flex-1">Keep Playing</Button>
                <Button onClick={initGame} className="flex-1">Restart</Button>
            </div>
         </div>
      </Modal>

      {/* Game Over Modal */}
       <Modal isOpen={gameOver} title="Game Over" showCloseButton={false}>
         <div className="text-center">
            <p className="text-gray-300 mb-4">No more moves possible.</p>
            <p className="text-4xl font-bold text-white mb-6">{score}</p>
            <Button onClick={initGame} className="w-full">Try Again</Button>
         </div>
      </Modal>

    </div>
  );
};

