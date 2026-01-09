import { useState, useCallback, useRef } from 'react';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_DECREMENT } from './constants';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type Point = { x: number; y: number };
type Direction = Point;
type FoodType = 'normal' | 'gold';
type Food = Point & { type: FoodType };

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIR = { x: 0, y: -1 }; // Moving Up

export const useSnake = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Food>({ x: 5, y: 5, type: 'normal' });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIR);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('snake-highscore', 0);
  const [status, setStatus] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  // Refs for loop state
  const directionQueue = useRef<Direction[]>([]);
  const timeSinceLastMove = useRef(0);
  const currentDirectionRef = useRef(INITIAL_DIR); // Track actul direction of movement

  const spawnFood = (currentSnake: Point[]): Food => {
      let newFood: Point;
      while (true) {
          newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
          };
          // Check collision with snake
          if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) {
              break;
          }
      }
      return { 
          ...newFood, 
          type: Math.random() < 0.1 ? 'gold' : 'normal' 
      };
  };

  const startGame = () => {
      setSnake(INITIAL_SNAKE);
      setDirection(INITIAL_DIR);
      currentDirectionRef.current = INITIAL_DIR;
      directionQueue.current = [];
      setScore(0);
      setSpeed(INITIAL_SPEED);
      setFood(spawnFood(INITIAL_SNAKE));
      setStatus('playing');
      timeSinceLastMove.current = 0;
  };

  const changeDirection = useCallback((newDir: Direction) => {
      // Add to queue
      directionQueue.current.push(newDir);
  }, []);

  const update = useCallback((deltaTime: number) => {
      if (status !== 'playing') return;

      timeSinceLastMove.current += deltaTime;

      if (timeSinceLastMove.current >= speed) {
          timeSinceLastMove.current -= speed; // Keep remainder

          // Process input
          let nextDir = currentDirectionRef.current;
          
          // Consume queue until valid move found or empty
          while(directionQueue.current.length > 0) {
              const candidate = directionQueue.current.shift()!;
              // Prevent reverse
              if (candidate.x !== -currentDirectionRef.current.x || candidate.y !== -currentDirectionRef.current.y) {
                  nextDir = candidate;
                  break;
              }
          }
          currentDirectionRef.current = nextDir;
          setDirection(nextDir);

          setSnake(prevSnake => {
              const head = prevSnake[0];
              const newHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };

              // Check walls
              if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
                  setStatus('gameover');
                  return prevSnake;
              }

              // Check self
              // Ignore tail because it will move (unless we just ate, handled below?)
              // Actually collision happens before move logic completes visually?
              // Standard snake: collision with body (including tail if not growing?)
              // If we move into tail spot, and tail moves, it's safe. 
              // But standard implementations check full body. 
              // We'll check all segments except the very last one (which moves away), unless we ate?
              // Simplest: Check all.
              // Logic: 1. Calculate new head. 2. Check collision. 3. Move.
              
              // If we don't eat, tail is removed. So newHead hitting prevSnake[last] is safe.
              // If we eat, tail stays. So newHead hitting prevSnake[last] is collision.
              
              const isEating = newHead.x === food.x && newHead.y === food.y;
              
              // Collision check
              // We check against prevSnake. If not eating, last segment is ignored for collision.
              // However, simpler to just check strict collision and edge cases.
              
              if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
                  // Only safe if it's the tail and we are NOT eating
                  const isTail = newHead.x === prevSnake[prevSnake.length-1].x && newHead.y === prevSnake[prevSnake.length-1].y;
                  if (!isTail || isEating) {
                      setStatus('gameover');
                      return prevSnake;
                  }
              }

              const newSnake = [newHead, ...prevSnake];
              
              if (isEating) {
                  const points = food.type === 'gold' ? 50 : 10;
                  setScore(s => {
                      const newScore = s + points;
                      if (newScore > highScore) setHighScore(newScore);
                      return newScore;
                  });
                  setSpeed(s => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
                  setFood(spawnFood(newSnake));
                  // Don't pop tail
              } else {
                  newSnake.pop();
              }

              return newSnake;
          });
      }
  }, [status, speed, food, highScore, setHighScore]);

  useGameLoop(update, status === 'playing');

  return { snake, food, direction, score, highScore, status, setStatus, startGame, changeDirection };
};

