import { useState, useEffect, useCallback } from 'react';
import { spawnTile, moveGrid, isGameOver } from './logic';
import { Grid, Direction, Tile } from './types';
import { createEmptyGrid } from './logic';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const use1024 = () => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useLocalStorage('1024-highscore', 0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false); // For 1024 tile
  const [keepPlaying, setKeepPlaying] = useState(false); // If user wants to continue after 1024

  const initGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = spawnTile(newGrid);
    newGrid = spawnTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const move = useCallback((dir: Direction) => {
    if (gameOver) return;
    if (won && !keepPlaying) return;

    const { newGrid, score: moveScore, moved } = moveGrid(grid, dir);

    if (moved) {
      const gridWithSpawn = spawnTile(newGrid);
      setGrid(gridWithSpawn);
      const newScore = score + moveScore;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      if (gridWithSpawn.flat().some((t: Tile | null) => t?.value === 1024) && !won) {
        setWon(true);
      }

      if (isGameOver(gridWithSpawn)) {
        setGameOver(true);
      }
    }
  }, [grid, score, bestScore, gameOver, won, keepPlaying, setBestScore]);

  const continueGame = () => setKeepPlaying(true);

  return { grid, score, bestScore, gameOver, won, keepPlaying, move, initGame, continueGame };
};

