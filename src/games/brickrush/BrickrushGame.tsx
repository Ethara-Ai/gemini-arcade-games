import React, { useRef, useEffect } from 'react';
import { useBrickrush } from './useBrickrush';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const BrickrushGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, startGame, movePaddle, setGameState } = useBrickrush();

  // Input handling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const x = (e.clientX - rect.left) * scaleX;
        movePaddle(x);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const x = (e.touches[0].clientX - rect.left) * scaleX;
        movePaddle(x);
        e.preventDefault();
    };

    const canvas = canvasRef.current;
    if (canvas) {
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    return () => {
        if (canvas) {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('touchmove', handleTouchMove);
        }
    };
  }, [movePaddle]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Paddle
    ctx.fillStyle = '#06b6d4'; // Cyan
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.fillRect(gameState.paddle.x, CANVAS_HEIGHT - gameState.paddle.height - 10, gameState.paddle.width, gameState.paddle.height);
    ctx.shadowBlur = 0;

    // Draw Balls
    gameState.balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    });

    // Draw Bricks
    gameState.bricks.forEach(brick => {
        if (!brick.visible) return;
        ctx.fillStyle = brick.color;
        
        if (brick.type === 'steel') {
            ctx.shadowColor = 'transparent';
        } else {
            ctx.shadowColor = brick.color;
            ctx.shadowBlur = 5;
        }
        
        ctx.fillRect(brick.x, brick.y, brick.width - 2, brick.height - 2);
        ctx.shadowBlur = 0;
    });

    // Draw UI (Score, Lives)
    ctx.fillStyle = '#fff';
    ctx.font = '20px Raleway';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, CANVAS_WIDTH - 100, 30);
    ctx.fillText(`Level: ${gameState.level}`, CANVAS_WIDTH / 2 - 30, 30);

  }, [gameState]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="max-w-full h-auto border-2 border-game-brick/30 rounded-lg shadow-2xl bg-black/40 backdrop-blur-sm cursor-none"
          style={{ aspectRatio: '4/3' }}
        />
        
        {/* Start Menu Overlay */}
        <Modal isOpen={gameState.state === 'menu'} showCloseButton={false} title="Brickrush">
            <div className="text-center">
                <p className="mb-6 text-gray-300">Break all the bricks! Don't let the ball drop.</p>
                <Button onClick={startGame} size="lg" className="w-full">Play Game</Button>
            </div>
        </Modal>

        {/* Game Over Overlay */}
        <Modal isOpen={gameState.state === 'gameover'} showCloseButton={false} title="Game Over">
            <div className="text-center">
                <p className="text-4xl font-bold text-game-brick mb-2">{gameState.score}</p>
                <p className="text-sm text-gray-400 mb-6">Final Score</p>
                <div className="flex gap-4">
                    <Button onClick={() => setGameState(prev => ({ ...prev, state: 'menu' }))} variant="secondary" className="flex-1">Menu</Button>
                    <Button onClick={startGame} className="flex-1">Try Again</Button>
                </div>
            </div>
        </Modal>
      </div>
    </div>
  );
};

