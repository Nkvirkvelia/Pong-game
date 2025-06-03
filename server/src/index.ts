const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { GameRoom } = require("./game/GameRoom");

const app = express();
app.use(cors());

app.get(
  "/ping",
  (_: import("express").Request, res: import("express").Response) => {
    res.send("pong");
  }
);

const httpServer = createServer(app);

const io: import("socket.io").Server = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Room manager (store room → socket IDs)
const rooms: Record<string, string[]> = {};
const activeGames: Record<string, InstanceType<typeof GameRoom>> = {};

io.on("connection", (socket: import("socket.io").Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join room logic
  socket.on("joinRoom", () => {
    let joinedRoom: string | null = null;

    // Try to find a room with 1 player
    for (const roomId in rooms) {
      if (rooms[roomId].length === 1) {
        rooms[roomId].push(socket.id);
        joinedRoom = roomId;
        break;
      }
    }

    // If none found, create a new one
    if (!joinedRoom) {
      joinedRoom = `room-${socket.id}`;
      rooms[joinedRoom] = [socket.id];
    }

    socket.join(joinedRoom);
    console.log(`Socket ${socket.id} joined room ${joinedRoom}`);

    // Let the client know which room it joined
    socket.emit("roomJoined", { roomId: joinedRoom });

    // If two players are now in the room, emit startGame and run game loop
    if (rooms[joinedRoom].length === 2) {
      io.to(joinedRoom).emit("startGame", { roomId: joinedRoom });

      const gameRoom = new GameRoom(joinedRoom, rooms[joinedRoom], io);
      gameRoom.start();
      activeGames[joinedRoom] = gameRoom;
    }
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove socket from any room it was part of
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);

      // If room is empty, delete it
      if (rooms[roomId].length === 0) {
        // Stop game loop if it exists
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
