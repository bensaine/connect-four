import { roomStore } from "./index.js";
const ROOM_CODE_LENGTH = 5;
const ROOM_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function addToCol(board, col, team) {
    if (!isColFull(board, col)) {
        let arr = getCol(board, col)
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].team == -1) {
                arr[i].team = team
                console.log(arr[i].team)
                break
            }
        }
        board = setCol(board, col, arr)
    }
    return board
}

export function getCol(board, col) {
    return board.map(row => row[col])
}

export function setCol(board, col, arr) {
    for (let i = 0; i < board.length; i++) {
        board[i][col] = arr[i]
    }
    return board
}

export function isColFull(board, col) {
    return getCol(board, col).filter(tile => tile.team === -1).length === 0
}

export function generateRoomCode() {
    let code = '';
    while (!code || roomStore.findRoom(code)) {
        for (var i = ROOM_CODE_LENGTH; i > 0; --i) code += ROOM_CODE_CHARACTERS[Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length)];
    }
    return code;
}
