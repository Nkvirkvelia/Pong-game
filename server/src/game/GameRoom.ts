import { Server } from "socket.io";
import { GameState } from "../../../shared/types";

// Constants
const FIELD_WIDTH = 600;
const FIELD_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_MARGIN = 20;

class GameRoom {
  private roomId: string;
  private players: string[];
  private io: Server;
  private interval: ReturnType<typeof setInterval> | null = null;
  private gameState: GameState;

  constructor(roomId: string, players: string[], io: Server) {
    this.roomId = roomId;
    this.players = players;
    this.io = io;

    const [player1, player2] = players;

    this.gameState = {
      ball: { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2, vx: 3, vy: 3 },
      players: {
        [player1]: { id: player1, y: FIELD_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
        [player2]: { id: player2, y: FIELD_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
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

  private resetBall(direction: number) {
    this.gameState.ball = {
      x: FIELD_WIDTH / 2,
      y: FIELD_HEIGHT / 2,
      vx: 3 * direction,
      vy: 3 * (Math.random() > 0.5 ? 1 : -1),
    };
  }

  update() {
    const ball = this.gameState.ball;
    const players = this.gameState.players;
    const score = this.gameState.score;

    const [player1, player2] = this.players;
    const paddle1 = players[player1];
    const paddle2 = players[player2];

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce off top/bottom
    if (ball.y <= 0 || ball.y + BALL_SIZE >= FIELD_HEIGHT) {
      ball.vy *= -1;
    }

    // Paddle collision - Left
    if (
      ball.x <= PADDLE_MARGIN + PADDLE_WIDTH &&
      ball.x >= PADDLE_MARGIN &&
      ball.y + BALL_SIZE >= paddle1.y &&
      ball.y <= paddle1.y + PADDLE_HEIGHT
    ) {
      ball.vx *= -1;
      ball.x = PADDLE_MARGIN + PADDLE_WIDTH + 1;
    }

    // Paddle collision - Right
    if (
      ball.x + BALL_SIZE >= FIELD_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
      ball.x <= FIELD_WIDTH - PADDLE_MARGIN &&
      ball.y + BALL_SIZE >= paddle2.y &&
      ball.y <= paddle2.y + PADDLE_HEIGHT
    ) {
      ball.vx *= -1;
      ball.x = FIELD_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE - 1;
    }

    // Scoring
    if (ball.x < 0) {
      score[player2]++;
      this.resetBall(-1);
    } else if (ball.x > FIELD_WIDTH) {
      score[player1]++;
      this.resetBall(1);
    }

    // Broadcast state
    this.io.to(this.roomId).emit("gameState", this.gameState);
  }

  getState(): GameState {
    return this.gameState;
  }
}

module.exports = { GameRoom };
