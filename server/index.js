import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { generateRoomCode, addToCol, isWinningMove, isBoardFull } from "./utils.js";
import { SessionStore } from "./sessionStore.js"
const sessionStore = new SessionStore();
import { RoomStore } from "./roomStore.js";
export const roomStore = new RoomStore();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

io.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    // find existing session
    const session = sessionStore.findSession(sessionId);
    if (session) {
      socket.sessionId = sessionId;
      socket.userId = session.userId;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    console.log(socket.handshake)
    return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionId = uuidv4();
  socket.userId = uuidv4();
  socket.username = username;
  next();
});

io.on("connection", async (socket) => {
  sessionStore.saveSession(socket.sessionId, {
    userId: socket.userId,
    username: socket.username,
    connected: true,
  });

  socket.emit("session", {
    sessionId: socket.sessionId,
    userId: socket.userId,
  });

  socket.on("getUser", (data, callback) => {
    callback(sessionStore.findUser(data.id));
  })

  socket.on("createRoom", (callback) => {
    const HEIGHT = 6;
    const WIDTH = 7;
    let board = []
    for (let i = 0; i < HEIGHT; i++) {
			board.push([])
			for (var j = 0; j < WIDTH; j++) {
				board[i][j] = {team: -1}
			}
		}
    const room = {
      id: generateRoomCode(),
      players: [{ ...sessionStore.findUser(socket.userId), team: 0 }],
      teams: [{ id: 0, name: "Player 1", color: "#fff500"}, { id: 1, name: "Player 2", color: "#ff0000"}],
      board,
      boardWidth: WIDTH,
      boardHeight: HEIGHT,
      turn: -1,
      winner: null,
      started: false,
      finished: false,
      startedAt: null,
      finishedAt: null,
    }
    roomStore.saveRoom(room)
    socket.join(room.id)
    callback(room)
  })

  socket.on("joinRoom", (data, callback) => {
    let room = roomStore.findRoom(data.id)
    if (!room || room.started) {
      return callback(new Error("invalid room"))
    }
    if (room.players.find(player => player.userId == socket.userId)) {
      return callback(new Error("already in room"))
    }
    room.players.push({ ...sessionStore.findUser(socket.userId), team: 1 })
    if (room.players.length == 2) {
      room = startRoom(room)
    }
    socket.join(room.id)
    updateRoom(room)
    callback(room);
  })

  socket.on("getRoomById", (data, callback) => {
    callback(roomStore.findRoom(data.id));
  })

  socket.on("getRoomByPlayer", (data, callback) => {
    callback(roomStore.findRoomByPlayer(data.id));
  })

  socket.on("getTeam", (data, callback) => {
    callback(roomStore.findPlayerTeamId(data.id));
  })

  socket.on("addToCol", (data) => {
    let room = roomStore.findRoom(data.roomId)
    let board = room.board
    if (!board) {
      return;
    }
    let team = roomStore.findPlayerTeamId(socket.userId, room)
    if (!room.started || room.finished || room.turn != team ) {
      return;
    }
    board = addToCol(board, data.col, team)
    room.turn = 1 - room.turn
    updateRoom(room)
    io.to(room.id).emit("playSound", "https://drive.google.com/uc?id=1YqdL_wbuF2MfeHV0yZcUYq1xP3mFbFQm&export=download")
    console.log("isWin", isWinningMove(board, data.col, team))
    if (isWinningMove(board, data.col, team) || isBoardFull(board)) {
      room.turn = -1
      room.winner = isBoardFull(board) ? -1 : team
      room.finished = true
      room.finishedAt = new Date()
      updateRoom(room)
      io.to(room.id).emit("playSound", "https://drive.google.com/uc?id=1L0uEBAYcKI74WyjedvowveEGGAgHzVNf&export=download")
    }
  })

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionId, {
        userId: socket.userId,
        username: socket.username,
        connected: false,
      });
    }
  });
});

function updateRoom(room) {
  roomStore.updateRoom(room.id, room)
  io.to(room.id).emit("updateRoom", room);
}

function startRoom(room) {
  if (room && !room.started) {
    room.started = true;
    room.startedAt = new Date();
    room.turn = room.teams[Math.floor(Math.random() * room.teams.length)].id;
  }
  return room
}

io.listen(process.env.PORT || 3000);