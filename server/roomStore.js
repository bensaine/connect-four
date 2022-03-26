export class RoomStore {
    constructor() {
        this.rooms = [];
    }

    findRoom(id) {
        return this.rooms.find(room => room.id == id);
    }

    findRoomByPlayer(id) {
        return this.rooms.find(room => room.players.find(player => player.userId == id));
    }

    findPlayerTeam(id, room = null) {
        room = room ? this.findRoomByPlayer(id) : room
        if (room) {
            return room.players.find(player => player.userId == id).team;
        }
    }

    saveRoom(room) {
        this.rooms.push(room);
    }

    updateRoom(roomId, room) {  
        const index = this.rooms.findIndex(room => room.id == roomId);
        this.rooms[index] = room;
    }

    findAllRooms() {
        return this.rooms;
    }
}