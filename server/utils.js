import { roomStore } from "./index.js";
const ROOM_CODE_LENGTH = 5;
const ROOM_CODE_CHARACTERS = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789"];

export function addToCol(board, col, team) {
    if (countColEmptySlots(board, col) != 0) {
        let arr = getCol(board, col)
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].team == -1) {
                arr[i].team = team
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

export function countColEmptySlots(board, col) {
    return getCol(board, col).filter(tile => tile.team === -1).length
}

export function isBoardFull(board) {
    return board.every(row => row.every(tile => tile.team != -1))
}

export function isWinningMove(board, col, team) {
    let row = countColEmptySlots(board, col)
    let horizontalWin = isLinearWin(getCol(board, col), team)
    let verticalWin = isLinearWin(board[row], team)
    let diagonalWin = isDiagonalWin(board, col, row, team)
    return horizontalWin || verticalWin || diagonalWin
}

function isLinearWin(arr, team) {
    let consecutive = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].team == team) {
            consecutive++
        } else {
            consecutive = 0
        }
        if (consecutive == 4) {
            return true
        }
    }
    return false
}

function isDiagonalWin(board, col, row, team) {
    let leftToRight = []
    let rightToLeft = []
    let i = col 
    let j = row
    while (i >= 0 && j >= 0) {
        leftToRight.push(board[j][i])
        rightToLeft.unshift(board[j][i])
        i--
        j--
    }
    console.log(leftToRight)
    console.log(rightToLeft)
    return leftToRight.filter(tile => tile.team == team).length == 4 || rightToLeft.filter(tile => tile.team == team).length == 4
}

export function generateRoomCode() {
    let code = '';
    while (!code || roomStore.findRoom(code)) {
        for (var i = ROOM_CODE_LENGTH; i > 0; --i) {
            let charSelection = ROOM_CODE_CHARACTERS[Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length)];
            code += charSelection[Math.floor(Math.random() * charSelection.length)];
        }
    }
    return code;
}
