import { writable } from "svelte/store"
import io from 'socket.io-client'

export const socketStore = writable(io("https://connect-four-bensaine.herokuapp.com"))
const localSession = localStorage.getItem("sessionId")
export const sessionStore = writable(localSession)
sessionStore.subscribe(value => localStorage.setItem("sessionId", value))
export const userStore = writable({})
export const roomStore = writable({})