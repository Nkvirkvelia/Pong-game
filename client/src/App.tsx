import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to server with ID:", socket.id);
      setIsConnected(true);

      // Emit joinRoom after connection is established
      socket.emit("joinRoom");
    });

    socket.on("disconnect", () => {
      console.log("🚫 Disconnected from server");
      setIsConnected(false);
      setRoomId(null);
      setGameStarted(false);
    });

    socket.on("roomJoined", (data: { roomId: string }) => {
      console.log(`🎯 Joined room: ${data.roomId}`);
      setRoomId(data.roomId);
    });

    socket.on("startGame", (data: { roomId: string }) => {
      console.log(`🎮 Game started in room: ${data.roomId}`);
      setGameStarted(true);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("roomJoined");
      socket.off("startGame");
    };
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <h1>Multiplayer Pong Game</h1>
      <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <p>Socket ID: {isConnected ? socket.id : "N/A"}</p>
      {roomId && <p>Room: {roomId}</p>}
      {gameStarted && <h2>🚀 Game Started!</h2>}
    </div>
  );
}

export default App;
