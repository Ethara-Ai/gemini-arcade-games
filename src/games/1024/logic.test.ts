import { describe, it, expect } from 'vitest';
import { moveGrid, createEmptyGrid } from './logic';

describe('1024 Logic', () => {
  it('slides numbers to the left', () => {
    const grid = createEmptyGrid();
    // Use manual construction since we use objects now
    // Wait, createEmptyGrid returns nulls.
    // I need to mock Tile objects.
    grid[0][0] = { id: 1, value: 2 };
    grid[0][1] = { id: 2, value: 2 };
    
    const { newGrid, score } = moveGrid(grid, 'left');
    
    expect(newGrid[0][0]?.value).toBe(4);
    expect(newGrid[0][1]).toBeNull();
    expect(score).toBe(4);
  });

  it('slides numbers to the right', () => {
    const grid = createEmptyGrid();
    grid[0][0] = { id: 1, value: 2 };
    grid[0][1] = { id: 2, value: 2 };
    
    const { newGrid, score } = moveGrid(grid, 'right');
    
    expect(newGrid[0][3]?.value).toBe(4);
    expect(score).toBe(4);
  });
});

