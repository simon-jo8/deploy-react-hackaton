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

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    
    // Add the new user to the connected users list
    connectedUsers.push({ id: socket.id, name: "User " + socket.id });

    // Send the updated user list to all clients
    socketIO.emit('user connected', connectedUsers);

    socket.on('disconnect', () => {
        console.log(`🔥: User ${socket.id} disconnected`);
        
        // Remove the disconnected user from the connected users list
        connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
        
        // Send the updated user list to all clients
        socketIO.emit('user disconnected', socket.id);
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});