export interface PlayerState {
  id: string;
  y: number;
}

export interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface GameState {
  ball: BallState;
  players: Record<string, PlayerState>; // key = socket.id
  score: Record<string, number>; // key = socket.id
  isRunning: boolean;
}
