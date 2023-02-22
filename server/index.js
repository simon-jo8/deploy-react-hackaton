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
let users = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    users.push({socket:socket,id:socket.id});
    
    // Add the new user to the connected users list
    connectedUsers.push({ id: socket.id, name: "User " + socket.id });

    // Send the updated user list to all clients
    socketIO.emit('user connected', connectedUsers);

    socket.emit('current user', { id: socket.id, name: `User ${socket.id}` });

    socket.on('disconnect', () => {
        // console.log(`🔥: User ${socket.id} disconnected`);
        
        // Remove the disconnected user from the connected users list
        connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
        
        // Send the updated user list to all clients
        socketIO.emit('user disconnected', socket.id);
    });

    socket.on('challenge', (opponentId, currentUser) => {
        // Send a message to the challenged user
        socket.to(opponentId).emit('challenged', currentUser);

    })

    socket.on('spell', (roomId, spell, spellAnimation, currentUser) => {
        // Send a message to the challenged user
        socketIO.to(roomId).emit('spell', spell, spellAnimation, currentUser);
    });

    socket.on('join',(room) => {
      socket.join(room);
    })

    socket.on('challenge user', (opponentId) => {
        console.log(`User ${socket.id} challenged user ${opponentId}`);

        let user_index = users.findIndex(user => user.id == opponentId);
        let socketB = users[user_index].socket;
        // Create a new room with the two players
        const roomId = `${socket.id}${opponentId}`;
        console.log(roomId);
        activeRooms.push(roomId);

        // Send each player to the room
        socket.join(roomId);
        socketB.join(roomId);

        // Send a message to both players indicating the room they are in
        // socket.emit('room created', roomId);
        socketIO.to(roomId).emit('room created',roomId);

        // socket.to(opponentId).emit('room created', roomId);
    });

    socket.on('leave room', (roomId) => {
        // console.log(`User ${socket.id} left room ${roomId}`);
        
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
