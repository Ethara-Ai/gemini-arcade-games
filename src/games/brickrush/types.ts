export interface Position {
  x: number;
  y: number;
}

export interface Vector {
  dx: number;
  dy: number;
}

export interface Ball {
  pos: Position;
  vel: Vector;
  radius: number;
  active: boolean;
}

export interface Paddle {
  x: number;
  width: number;
  height: number;
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  type: 'normal' | 'steel' | 'powerup';
  color: string;
  visible: boolean;
}

export interface PowerUp {
  x: number;
  y: number;
  type: 'extra_ball' | 'wide_paddle';
  active: boolean;
}

export interface GameState {
  balls: Ball[];
  paddle: Paddle;
  bricks: Brick[];
  powerUps: PowerUp[];
  score: number;
  lives: number;
  level: number;
  state: 'menu' | 'playing' | 'paused' | 'gameover' | 'level_complete';
}

