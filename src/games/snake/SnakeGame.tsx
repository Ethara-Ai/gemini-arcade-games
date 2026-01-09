import React, { useRef, useEffect } from 'react';
import { useSnake } from './useSnake';
import { GRID_SIZE, CELL_SIZE } from './constants';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { IoArrowUp, IoArrowDown, IoArrowBack, IoArrowForward } from 'react-icons/io5';

// Canvas size based on grid
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { snake, food, score, highScore, status, setStatus, startGame, changeDirection } = useSnake();

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
        case 'w': changeDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown':
        case 's': changeDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft':
        case 'a': changeDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight':
        case 'd': changeDirection({ x: 1, y: 0 }); break;
        case 'p': 
        case ' ': 
            if (status === 'playing') setStatus('paused');
            else if (status === 'paused') setStatus('playing');
            break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, status, setStatus]);

  // Swipe handling (Basic)
  const touchStart = useRef<{x:number, y:number} | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      
      if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.abs(dx) > 30) changeDirection(dx > 0 ? {x:1, y:0} : {x:-1, y:0});
      } else {
          if (Math.abs(dy) > 30) changeDirection(dy > 0 ? {x:0, y:1} : {x:0, y:-1});
      }
      touchStart.current = null;
  };

  // Render Loop
  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw Grid (Optional, subtle)
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for(let i=0; i<=GRID_SIZE; i++) {
          ctx.beginPath();
          ctx.moveTo(i * CELL_SIZE, 0);
          ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i * CELL_SIZE);
          ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
          ctx.stroke();
      }

      // Draw Snake
      snake.forEach((segment, index) => {
          ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e'; // Head lighter
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = index === 0 ? 10 : 5;
          
          // Slight rounding?
          const x = segment.x * CELL_SIZE;
          const y = segment.y * CELL_SIZE;
          const s = CELL_SIZE - 2; // Gap
          ctx.fillRect(x + 1, y + 1, s, s);
          
          // Eyes for head
          if (index === 0) {
              ctx.shadowBlur = 0;
              ctx.fillStyle = '#000';
              // Logic for eye position based on direction?
              // Simple: Center eyes
              ctx.fillRect(x + 5, y + 5, 4, 4);
              ctx.fillRect(x + 11, y + 5, 4, 4);
          }
      });
      ctx.shadowBlur = 0;

      // Draw Food
      const fx = food.x * CELL_SIZE;
      const fy = food.y * CELL_SIZE;
      
      if (food.type === 'gold') {
          ctx.fillStyle = '#ffd700';
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(fx + CELL_SIZE/2, fy + CELL_SIZE/2, CELL_SIZE/2 - 2, 0, Math.PI*2);
          ctx.fill();
      } else {
          ctx.fillStyle = '#ec4899'; // Pink
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(fx + CELL_SIZE/2, fy + CELL_SIZE/2, CELL_SIZE/3, 0, Math.PI*2);
          ctx.fill();
      }
      ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4"
         onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        
        <div className="flex justify-between w-full max-w-[400px] mb-4">
             <div className="glass-panel px-4 py-2">
                 <span className="text-gray-400 text-sm">SCORE</span>
                 <div className="text-2xl font-bold text-white">{score}</div>
             </div>
             <div className="glass-panel px-4 py-2 text-right">
                 <span className="text-gray-400 text-sm">BEST</span>
                 <div className="text-2xl font-bold text-game-snake">{highScore}</div>
             </div>
        </div>

        <div className="relative">
            <canvas 
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="bg-black/50 border-2 border-game-snake/30 rounded-lg shadow-2xl backdrop-blur-sm"
                style={{ width: '100%', maxWidth: '400px', height: 'auto', aspectRatio: '1/1' }}
            />
            
            <Modal isOpen={status === 'menu'} title="Snake" showCloseButton={false}>
                <div className="text-center">
                    <p className="mb-6 text-gray-300">Eat regular (pink) and golden food to grow. Don't hit the walls!</p>
                    <Button onClick={startGame} className="w-full" size="lg">Play Game</Button>
                </div>
            </Modal>

            <Modal isOpen={status === 'paused'} title="Paused" onClose={() => setStatus('playing')}>
                <div className="flex flex-col gap-3">
                    <Button onClick={() => setStatus('playing')}>Resume</Button>
                    <Button variant="secondary" onClick={() => setStatus('menu')}>Quit to Menu</Button>
                </div>
            </Modal>

            <Modal isOpen={status === 'gameover'} title="Game Over" showCloseButton={false}>
                <div className="text-center">
                    <p className="text-gray-400">You scored</p>
                    <p className="text-5xl font-bold text-game-snake mb-6">{score}</p>
                    <div className="flex gap-3">
                         <Button variant="secondary" onClick={() => setStatus('menu')} className="flex-1">Menu</Button>
                         <Button onClick={startGame} className="flex-1">Play Again</Button>
                    </div>
                </div>
            </Modal>
        </div>

        {/* Mobile D-Pad */}
        <div className="mt-8 grid grid-cols-3 gap-2 md:hidden">
            <div />
            <Button variant="secondary" size="sm" onClick={() => changeDirection({x:0, y:-1})}><IoArrowUp /></Button>
            <div />
            <Button variant="secondary" size="sm" onClick={() => changeDirection({x:-1, y:0})}><IoArrowBack /></Button>
            <Button variant="secondary" size="sm" onClick={() => changeDirection({x:0, y:1})}><IoArrowDown /></Button>
            <Button variant="secondary" size="sm" onClick={() => changeDirection({x:1, y:0})}><IoArrowForward /></Button>
        </div>
    </div>
  );
};

