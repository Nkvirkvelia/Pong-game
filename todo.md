### Task 1: Set up frontend project with React + TypeScript

[x] 1.1 – Create React app using Vite + TypeScript
[x] 1.2 – Clean boilerplate and confirm app runs
[x] 1.3 – Create frontend folder structure (`components/`, `hooks/`, `types/`, `pages/`, etc.)

### Task 2: Set up backend server with Node.js + TypeScript + Socket.IO

[x] 2.1 – Initialize Node.js project with TypeScript (`npm init`, `tsconfig.json`, `src/` folder)
[x] 2.2 – Install and configure Socket.IO server
[x] 2.3 – Set up base Express server with `/ping` test route
[x] 2.4 – Configure backend scripts, nodemon, and folder structure
[x] 2.5 – Confirm WebSocket connection between client and server

### Task 3: Create game room and connection logic (Socket.IO)

[x] 3.1 – Implement `joinRoom` event from client and match 2 players
[x] 3.2 – Emit `startGame` event when both players are connected
[ ] 3.3 – Handle `playerDisconnect` and room cleanup

### Task 4: Implement server[ ]side game logic and physics

[x] 4.1 – Define shared `GameState`, `Player`, and `Ball` interfaces in `shared/types.ts`
[x] 4.2 – Create `GameRoom` class to manage game loop and player state
[x] 4.3 – Implement ball movement and timer[ ]based game loop (60 FPS)
[x] 4.4 – Add collision detection: ball with walls and paddles
[x] 4.5 – Implement scoring and reset logic after point
[x] 4.6 – Emit `gameState` update to both clients continuously

### Task 5: Build real[ ]time UI in React frontend

[x] 5.1 – Create game canvas or layout using HTML5 + CSS
[x] 5.2 – Render paddles, ball, and score from `gameState`
[ ] 5.3 – Capture player input with keyboard (W/S or Up/Down)
[ ] 5.4 – Emit `playerMove` events to server on key press
[ ] 5.5 – Animate paddle/ball positions based on incoming state

### Task 6: Integrate and finalize full[ ]stack game

[ ] 6.1 – Use shared types for both frontend and backend to enforce consistency
[ ] 6.2 – Connect React components with WebSocket events
[ ] 6.3 – Test full game loop with two local clients
[ ] 6.4 – Handle edge cases (disconnects, late joins, etc.)
[ ] 6.5 – Polish UI and controls for smoother gameplay
