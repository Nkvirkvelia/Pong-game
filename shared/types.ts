export interface GameState {
  ball: { x: number; y: number };
  paddles: { [id: string]: { y: number } };
  score: { [id: string]: number };
}
