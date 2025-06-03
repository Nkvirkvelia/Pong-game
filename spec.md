**Project:** Multiplayer Pong Game

### 1. Overview

This project is a real-time, multiplayer version of the classic Pong game. Two players connect to a central server and control paddles on either side of the screen. A ball moves between them, and points are scored when a player misses the ball. The game state must be synchronized in real-time between both players using WebSockets.

---

### 2. Technologies

- **Frontend:** React + TypeScript
- **Backend:** Node.js + TypeScript
- **WebSocket Library:** Socket.IO

---

### 3. Features

- Real-time two-player game with synchronized state
- Ball and paddle movement with basic collision physics
- Room-based player matchmaking (2 players per room)
- Keyboard controls for paddle movement
- Real-time score updates

---

### 4. Architecture

- **Client Side (React):**

  - Render game UI: paddles, ball, score
  - Capture keyboard input
  - Send paddle movement to server
  - Receive game state updates

- **Server Side (Node.js):**

  - Manage game rooms
  - Control ball physics, paddle collision, scoring
  - Emit updated game state to clients at regular intervals

---

### 5. Game Logic

- **Paddle Movement:** Controlled by 'W' and 'S' keys (Player 1), and Up/Down arrows (Player 2)
- **Ball Physics:**

  - Moves continuously
  - Bounces off top and bottom walls
  - Bounces off paddles with angle depending on hit location

- **Scoring:**

  - Score is updated when a player misses the ball
  - Game state is reset after a score

---

### 6. Real-Time Communication Events

- `joinRoom`: Client requests to join a game room
- `startGame`: Server starts game when two players are present
- `playerMove`: Client sends paddle movement
- `gameState`: Server broadcasts current game state (positions, scores)
- `playerDisconnect`: Handles disconnection cleanup

---

### 7. TypeScript

- Use shared types/interfaces in a `shared/` directory to ensure consistency across client and server
- Strict mode enabled in both frontend and backend
