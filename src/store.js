import { writable } from "svelte/store"
import io from 'socket.io-client'

const defaultSettings = {
    mute: false,
}

export const socketStore = writable(io({transports: ['websocket'], upgrade: false}))
const localSession = localStorage.getItem("sessionId")
export const sessionStore = writable(localSession)
sessionStore.subscribe(value => localStorage.setItem("sessionId", value))
const localSettings = JSON.parse(localStorage.getItem("settings"))
export const settingsStore = writable(localSettings || defaultSettings)
settingsStore.subscribe(value => localStorage.setItem("settings", JSON.stringify(value)))
export const userStore = writable({})
export const roomStore = writable({})

export const getUserTeam = (players, userId) => {
    return players.find(player => player.userId === userId).team
}

export const getTeamColors = (teams) => {
    return Object.assign({}, ...teams.map((team) => ({[team.id]: team.color})))
}
