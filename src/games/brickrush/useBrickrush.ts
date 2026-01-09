import { useState, useCallback, useRef } from 'react';
import { GameState, Ball, Brick, Paddle } from './types';
import { useGameLoop } from '../../hooks/useGameLoop';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, 
  BALL_RADIUS, BRICK_ROWS, BRICK_COLS, BRICK_PADDING, 
  BRICK_WIDTH, BRICK_HEIGHT 
} from './constants';

const INITIAL_BALL: Ball = {
  pos: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 40 },
  vel: { dx: 4, dy: -4 },
  radius: BALL_RADIUS,
  active: true,
};

const INITIAL_PADDLE: Paddle = {
  x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};

export const useBrickrush = () => {
  const [gameState, setGameState] = useState<GameState>({
    balls: [{ ...INITIAL_BALL }],
    paddle: { ...INITIAL_PADDLE },
    bricks: [],
    powerUps: [],
    score: 0,
    lives: 3,
    level: 1,
    state: 'menu',
  });

  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  const initLevel = (level: number) => {
    const bricks: Brick[] = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        // Simple pattern: Skip some to make shapes
        if (Math.random() > 0.1) {
            const x = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING;
            const y = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + 50;
            const type = Math.random() < 0.05 ? 'steel' : Math.random() < 0.1 ? 'powerup' : 'normal';
            bricks.push({
                x,
                y,
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT,
                value: 10 * level,
                type: type,
                color: type === 'steel' ? '#9ca3af' : `hsl(${c * 36}, 70%, 50%)`,
                visible: true,
            });
        }
      }
    }
    return bricks;
  };

  const startGame = () => {
    setGameState({
      balls: [{ ...INITIAL_BALL }],
      paddle: { ...INITIAL_PADDLE },
      bricks: initLevel(1),
      powerUps: [],
      score: 0,
      lives: 3,
      level: 1,
      state: 'playing',
    });
  };

  const update = useCallback((deltaTime: number) => {
    if (stateRef.current.state !== 'playing') return;
    
    // Use a fixed time step or factor for simplicity in MVP, but use deltaTime for smooth movement
    // deltaTime is in ms. Let's assume 60fps ~ 16ms.
    const timeScale = deltaTime / 16.67; 

    setGameState((prev) => {
      let { balls, paddle, bricks, score, lives, level, state } = prev;
      let newBalls = [...balls];
      let newBricks = [...bricks];
      let newLives = lives;
      let newScore = score;
      let newState = state;

      // Move Paddle (handled by event listeners mostly, but clamped here)
      // Actually paddle position is usually direct from mouse/touch, so we just clamp it
      
      // Move Balls
      newBalls = newBalls.map(ball => {
        let { x, y } = ball.pos;
        let { dx, dy } = ball.vel;

        x += dx * timeScale;
        y += dy * timeScale;

        // Wall collisions
        if (x + ball.radius > CANVAS_WIDTH || x - ball.radius < 0) {
          dx = -dx;
          x = x < 0 ? ball.radius : CANVAS_WIDTH - ball.radius;
        }
        if (y - ball.radius < 0) {
          dy = -dy;
          y = ball.radius;
        } else if (y + ball.radius > CANVAS_HEIGHT) {
            // Ball lost
            return { ...ball, pos: { x, y }, vel: { dx, dy }, active: false };
        }

        // Paddle collision
        if (
            y + ball.radius >= CANVAS_HEIGHT - paddle.height - 10 &&
            y - ball.radius <= CANVAS_HEIGHT - 10 &&
            x >= paddle.x &&
            x <= paddle.x + paddle.width
        ) {
            dy = -Math.abs(dy); // Always bounce up
            // Add some English based on where it hit the paddle
            const hitPoint = x - (paddle.x + paddle.width / 2);
            dx = hitPoint * 0.15; 
        }

        // Brick collision
        for (let i = 0; i < newBricks.length; i++) {
            const b = newBricks[i];
            if (b.visible && 
                x + ball.radius > b.x && 
                x - ball.radius < b.x + b.width && 
                y + ball.radius > b.y && 
                y - ball.radius < b.y + b.height
            ) {
                dy = -dy; // Simple bounce
                if (b.type !== 'steel') {
                    newBricks[i] = { ...b, visible: false };
                    newScore += b.value;
                    // TODO: Spawn powerup
                }
                break; // Only hit one brick per frame roughly
            }
        }

        return { ...ball, pos: { x, y }, vel: { dx, dy } };
      }).filter(b => b.active);

      if (newBalls.length === 0) {
        newLives -= 1;
        if (newLives > 0) {
            // Reset ball
             newBalls = [{ ...INITIAL_BALL }];
        } else {
            newState = 'gameover';
        }
      }

      if (newBricks.every(b => !b.visible || b.type === 'steel')) {
          // Level Complete (simplified for now)
          // Just respawn bricks
          newBricks = initLevel(level + 1);
          level += 1;
          // Reset ball
          newBalls = [{ ...INITIAL_BALL }];
      }

      return {
        ...prev,
        balls: newBalls,
        bricks: newBricks,
        score: newScore,
        lives: newLives,
        state: newState,
        level
      };
    });
  }, []);

  useGameLoop(update, gameState.state === 'playing');

  const movePaddle = (x: number) => {
      setGameState(prev => ({
          ...prev,
          paddle: {
              ...prev.paddle,
              x: Math.max(0, Math.min(CANVAS_WIDTH - prev.paddle.width, x - prev.paddle.width / 2))
          }
      }));
  };

  return { gameState, startGame, movePaddle, setGameState };
};

