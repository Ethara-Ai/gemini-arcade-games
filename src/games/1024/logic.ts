import { Tile, Grid, SIZE, Direction } from './types';

let idCounter = 0;

const getNextId = () => ++idCounter;

export const createEmptyGrid = (): Grid => 
  Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

export const spawnTile = (grid: Grid): Grid => {
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) emptyCells.push([r, c]);
    }
  }

  if (emptyCells.length === 0) return grid;

  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = { id: getNextId(), value: Math.random() < 0.9 ? 2 : 4 };
  return newGrid;
};

// Helper: Slide row left
const slideRow = (row: (Tile | null)[]): { newRow: (Tile | null)[], score: number } => {
    // 1. Remove nulls
    let tiles = row.filter(t => t !== null) as Tile[];
    let score = 0;
    
    // 2. Merge
    const mergedTiles: Tile[] = [];
    let skip = false;
    for(let i=0; i<tiles.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        
        if (i < tiles.length - 1 && tiles[i].value === tiles[i+1].value) {
            // Merge
            // We create a NEW tile with a NEW ID to represent the merged one?
            // Or keep one ID? 
            // Usually we keep the ID of the "survivor" or create a new one. 
            // To animate "A and B merge into C", we'd ideally show A and B moving, then C appearing.
            // For React simple list, we just replace them with C.
            const newValue = tiles[i].value * 2;
            score += newValue;
            mergedTiles.push({ id: getNextId(), value: newValue, merged: true });
            skip = true;
        } else {
            // Reset merged flag
            mergedTiles.push({ ...tiles[i], merged: false });
        }
    }
    
    // 3. Pad with nulls
    const newRow: (Tile | null)[] = [...mergedTiles];
    while(newRow.length < SIZE) newRow.push(null);
    
    return { newRow, score };
};

const rotateLeft = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      newGrid[SIZE - 1 - c][r] = grid[r][c];
    }
  }
  return newGrid;
};

export const moveGrid = (grid: Grid, direction: Direction): { newGrid: Grid, score: number, moved: boolean } => {
  let tempGrid = grid.map(row => [...row]);
  let score = 0;
  let rotations = 0;
  
  if (direction === 'up') rotations = 1;
  if (direction === 'right') rotations = 2;
  if (direction === 'down') rotations = 3;

  for(let i=0; i<rotations; i++) tempGrid = rotateLeft(tempGrid);

  let moved = false;
  const processedGrid = tempGrid.map(row => {
    const { newRow, score: rowScore } = slideRow(row);
    score += rowScore;
    
    // Check if changed
    // Simple check: compare IDs
    for(let i=0; i<SIZE; i++) {
        if (row[i]?.id !== newRow[i]?.id) moved = true;
    }
    
    return newRow;
  });
  
  tempGrid = processedGrid;
  
  for(let i=0; i<(4-rotations)%4; i++) tempGrid = rotateLeft(tempGrid);

  return { newGrid: tempGrid, score, moved };
};

export const isGameOver = (grid: Grid): boolean => {
    for(let r=0; r<SIZE; r++)
        for(let c=0; c<SIZE; c++)
            if(grid[r][c] === null) return false;

    for(let r=0; r<SIZE; r++){
        for(let c=0; c<SIZE; c++){
            if(c < SIZE-1 && grid[r][c]?.value === grid[r][c+1]?.value) return false;
            if(r < SIZE-1 && grid[r][c]?.value === grid[r+1][c]?.value) return false;
        }
    }
    return true;
};
