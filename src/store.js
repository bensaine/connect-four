import { writable } from "svelte/store"
import io from 'socket.io-client'

export const socketStore = writable(io())
const localSession = localStorage.getItem("sessionId")
export const sessionStore = writable(localSession)
sessionStore.subscribe(value => localStorage.setItem("sessionId", value))
export const userStore = writable({})
export const roomStore = writable({})

export const getUserTeam = (room, userId) => {
    return getTeamPlayer(room, userId).team
}

export const getTeamPlayer = (room, userId) => {
    return room.players.find(player => player.userId === userId)
}

export const getTeamColor = (room, teamId) => {
    return teamId >= 0 ? room.teams.find(team => team.id == teamId).color : '#fff'
}
