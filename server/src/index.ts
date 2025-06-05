import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { GameRoom } from "./game/GameRoom";

const app = express();
app.use(cors());

app.get("/ping", (_, res) => {
  res.send("pong");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Room manager
const rooms: Record<string, string[]> = {};
const activeGames: Record<string, GameRoom> = {};

io.on("connection", (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // --- Join Room ---
  socket.on("joinRoom", () => {
    let joinedRoom: string | null = null;

    for (const roomId in rooms) {
      if (rooms[roomId].length === 1) {
        rooms[roomId].push(socket.id);
        joinedRoom = roomId;
        break;
      }
    }

    if (!joinedRoom) {
      joinedRoom = `room-${socket.id}`;
      rooms[joinedRoom] = [socket.id];
    } else if (rooms[joinedRoom].length > 2) {
      // Just in case — shouldn't happen
      socket.emit("errorMessage", "Room is full");
      return;
    }

    socket.join(joinedRoom);
    console.log(`Socket ${socket.id} joined room ${joinedRoom}`);
    socket.emit("roomJoined", { roomId: joinedRoom });

    if (rooms[joinedRoom].length === 2) {
      io.to(joinedRoom).emit("startGame", { roomId: joinedRoom });
      const gameRoom = new GameRoom(joinedRoom, rooms[joinedRoom], io);
      gameRoom.start();
      activeGames[joinedRoom] = gameRoom;
    }
  });

  // --- Player Move ---
  socket.on("playerMove", (direction: "up" | "down") => {
    for (const roomId in rooms) {
      if (rooms[roomId].includes(socket.id) && activeGames[roomId]) {
        activeGames[roomId].handlePlayerMove(socket.id, direction);
      }
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);

      if (rooms[roomId].length === 0) {
        if (activeGames[roomId]) {
          activeGames[roomId].stop();
          delete activeGames[roomId];
        }

        delete rooms[roomId];
        console.log(`Room ${roomId} deleted`);
      }
    }
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
