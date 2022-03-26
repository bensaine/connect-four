import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { generateRoomCode, addToCol } from "./utils.js";
import { SessionStore } from "./sessionStore.js"
const sessionStore = new SessionStore();
import { RoomStore } from "./roomStore.js";
export const roomStore = new RoomStore();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://connect-four-bensaine.herokuapp.com"
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
      teams: [{ id: 0, name: "Team 1", color: "#fff500"}, { id: 1, name: "Team 2", color: "#ff0000"}],
      board,
      boardWidth: WIDTH,
      boardHeight: HEIGHT,
      turn: 0,
      winner: null,
      started: false,
      finished: false,
      startedAt: null,
      finishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    roomStore.saveRoom(room)
    socket.join(room.id)
    callback(room)
  })

  socket.on("joinRoom", (data, callback) => {
    const room = roomStore.findRoom(data.id)
    if (!room || room.started) {
      return callback(new Error("invalid room"))
    }
    if (room.players.find(player => player.userId == socket.userId)) {
      return callback(new Error("already in room"))
    }
    room.players.push({ ...sessionStore.findUser(socket.userId), team: 1 })
    if (room.players.length == 2) {
      room.started = true
      room.startedAt = new Date()
    }
    socket.join(room.id)
    console.log("to", room.id)
    io.to(room.id).emit("updateRoom", room)
    callback(room);
  })

  socket.on("getRoomById", (data, callback) => {
    callback(roomStore.findRoom(data.id));
  })

  socket.on("getRoomByPlayer", (data, callback) => {
    callback(roomStore.findRoomByPlayer(data.id));
  })

  socket.on("getTeam", (data, callback) => {
    console.log("getTeam", data)
    callback(roomStore.findPlayerTeam(data.id));
  })

  socket.on("addToCol", (data) => {
    let room = roomStore.findRoom(data.roomId)
    let board = room.board
    console.log("addToCol", data)
    if (!board) {
      return;
    }
    let team = roomStore.findPlayerTeam(socket.userId, room)
    if (!room.started || room.finished || room.turn != team ) {
      return;
    }
    board = addToCol(board, data.col, team)
    room.turn = 1 - room.turn
    roomStore.updateRoom(data.roomId, room)
    console.log("to", data.roomId)
    io.to(data.roomId).emit("updateRoom", room);
    io.to(data.roomId).emit("playSound", "https://drive.google.com/uc?id=1YqdL_wbuF2MfeHV0yZcUYq1xP3mFbFQm&export=download")
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

io.listen(3000);