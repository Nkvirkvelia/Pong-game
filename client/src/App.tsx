import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <h1>Multiplayer Pong Game</h1>
      <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <p>Socket ID: {isConnected ? socket.id : "N/A"}</p>
    </div>
  );
}

export default App;
