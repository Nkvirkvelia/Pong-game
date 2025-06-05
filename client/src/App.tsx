import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { GameState } from "../../shared/types";

const socket: Socket = io("http://localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinRoom");
    });

    socket.on("roomJoined", ({ roomId }) => {
      setRoomId(roomId);
    });

    socket.on("startGame", () => {
      setGameStarted(true);
    });

    socket.on("gameState", (state: GameState) => {
      setGameState(state);
    });

    socket.on("errorMessage", (msg: string) => {
      alert(msg);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setGameStarted(false);
      setRoomId(null);
      setGameState(null);
    });

    return () => {
      socket.off("connect");
      socket.off("roomJoined");
      socket.off("startGame");
      socket.off("gameState");
      socket.off("errorMessage");
      socket.off("disconnect");
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      if (e.key === "w" || e.key === "ArrowUp") {
        socket.emit("playerMove", "up");
      } else if (e.key === "s" || e.key === "ArrowDown") {
        socket.emit("playerMove", "down");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted]);

  // Draw game frame
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !gameState) return;

    const { ball, players, score } = gameState;
    const playerIds = Object.keys(players);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Draw paddles
    playerIds.forEach((id, index) => {
      const x = index === 0 ? 20 : canvas.width - 30;
      const y = players[id].y;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y, 10, 80);
    });

    // Draw score
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(
      `${score[playerIds[0]]} - ${score[playerIds[1]]}`,
      canvas.width / 2 - 20,
      30
    );
  }, [gameState]);

  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <h1>Multiplayer Pong Game</h1>
      <p>
        Status:{" "}
        {isConnected ? (
          <span style={{ color: "green" }}>🟢 Connected</span>
        ) : (
          <span style={{ color: "red" }}>🔴 Disconnected</span>
        )}
      </p>
      <p>Socket ID: {isConnected ? socket.id : "N/A"}</p>
      <p>Room: {roomId ?? "N/A"}</p>
      {gameStarted && <p>🚀 Game Started!</p>}

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          background: "#000",
          border: "2px solid white",
          display: "block",
          margin: "20px auto",
        }}
      />
    </div>
  );
}

export default App;
