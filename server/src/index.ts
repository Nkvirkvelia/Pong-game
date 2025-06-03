const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

// ✅ Import type declarations from Express and Socket.IO
/** @type {import('express').Request} */
const app = express();
app.use(cors());

// ✅ Add explicit types for route handler
/** @type {import('express').RequestHandler} */
app.get(
  "/ping",
  (_: import("express").Request, res: import("express").Response) => {
    res.send("pong");
  }
);

const httpServer = createServer(app);

// ✅ Add Socket.IO type
/** @type {import('socket.io').Server} */
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Explicitly type the socket
io.on("connection", (socket: import("socket.io").Socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
