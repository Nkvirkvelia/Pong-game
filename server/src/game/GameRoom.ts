import { Server, Socket } from "socket.io";
import { GameState } from "../../../shared/types";

class GameRoom {
  private roomId: string;
  private players: string[]; // socket IDs
  private io: Server;
  private interval: ReturnType<typeof setInterval> | null = null;
  private gameState: GameState;

  constructor(roomId: string, players: string[], io: Server) {
    this.roomId = roomId;
    this.players = players;
    this.io = io;

    const [player1, player2] = players;

    this.gameState = {
      ball: { x: 300, y: 200, vx: 3, vy: 3 },
      players: {
        [player1]: { id: player1, y: 200 },
        [player2]: { id: player2, y: 200 },
      },
      score: {
        [player1]: 0,
        [player2]: 0,
      },
      isRunning: false,
    };
  }

  start() {
    this.gameState.isRunning = true;
    this.interval = setInterval(() => this.update(), 1000 / 60); // 60 FPS
  }

  stop() {
    this.gameState.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  update() {
    const ball = this.gameState.ball;

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce off top/bottom
    if (ball.y <= 0 || ball.y >= 400) {
      ball.vy *= -1;
    }

    // TODO: Add paddle collision + scoring later

    // Broadcast state to clients
    this.io.to(this.roomId).emit("gameState", this.gameState);
  }

  getState(): GameState {
    return this.gameState;
  }
}

module.exports = { GameRoom };
