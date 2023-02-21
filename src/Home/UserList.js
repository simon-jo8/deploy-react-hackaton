import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('user connected', (connectedUsers) => {
        setUsers(connectedUsers);
        });

        socket.on('user disconnected', (disconnectedUserId) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== disconnectedUserId));
        });
    }, []);

    return (
        <ul>
        {users.map((user) => (
            <li key={user.id}>{user.name}</li>
        ))}
        </ul>
    );
}

export default UserList;