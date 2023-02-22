const express = require("express");
const PORT = 4000;
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});

app.use(cors());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server" });
});

let connectedUsers = [];
let activeRooms = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    
    // Add the new user to the connected users list
    connectedUsers.push({ id: socket.id, name: "User " + socket.id });

    // Send the updated user list to all clients
    socketIO.emit('user connected', connectedUsers);

    socket.emit('current user', { id: socket.id, name: `User ${socket.id}` });

    socket.on('disconnect', () => {
        console.log(`🔥: User ${socket.id} disconnected`);
        
        // Remove the disconnected user from the connected users list
        connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
        
        // Send the updated user list to all clients
        socketIO.emit('user disconnected', socket.id);
    });

    socket.on('challenge user', (opponentId) => {
        console.log(`User ${socket.id} challenged user ${opponentId}`);
        
        // Create a new room with the two players
        const roomId = `${socket.id}-${opponentId}`;
        activeRooms.push(roomId);
        
        // Send each player to the room
        socket.join(roomId);
        socket.to(roomId).emit('join room', roomId);
        socket.to(opponentId).emit('join room', roomId);
        
        // Send a message to both players indicating the room they are in
        socket.emit('room created', roomId);
        socket.to(opponentId).emit('room created', roomId);
    });

    socket.on('leave room', (roomId) => {
        console.log(`User ${socket.id} left room ${roomId}`);
        
        // Remove the room from the active rooms list
        activeRooms = activeRooms.filter((room) => room !== roomId);
        
        // Leave the room
        socket.leave(roomId);
        
        // Send a message to all players in the room that the user left
        socket.to(roomId).emit('user left', socket.id);
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
