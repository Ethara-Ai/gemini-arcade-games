export interface Tile {
  id: number;
  value: number;
  merged?: boolean;
}

export type Grid = (Tile | null)[][];
export type Direction = 'up' | 'down' | 'left' | 'right';

export const SIZE = 4;
