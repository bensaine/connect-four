export class SessionStore {
    constructor() {
        this.sessions = new Map();
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    findUser(id) {
        return this.findAllSessions().find(session => session.userId == id);
    }

    saveSession(id, room) {
        this.sessions.set(id, room);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}