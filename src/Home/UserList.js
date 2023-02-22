import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './UserList.css';

const socket = io('http://localhost:4000');

function UserList() {
  const [currentUser, setCurrentUser] = useState({});
  const [otherUsers, setOtherUsers] = useState([]);
  let [inRoom, setInRoom] = useState(false);

  useEffect(() => {
    socket.on('user connected', (connectedUsers) => {
      let [firstUser, ...restUsers] = connectedUsers;
      setCurrentUser(firstUser);
      setOtherUsers(restUsers);
    });

    socket.on('user disconnected', (disconnectedUserId) => {
      setOtherUsers((prevUsers) => prevUsers.filter((user) => user.id !== disconnectedUserId));
    });

    // Emit an event to request the current user information from the server
    socket.emit('get current user', (currentUser) => {
      setCurrentUser(currentUser);
    });

    socket.on('room created', (room) => {
      // Redirect to the new room using the window.location object
      window.location = `/rooms/${room.id}`;
    });

  }, []);

  return (
    <div className="user-list-container">
      {inRoom ? (
        <div className="in-room-box">
          <p>You are currently in a room.</p>
        </div>
      ) : null}
      <div className="current-user">
        <h3>Current User</h3>
        <p>{currentUser.name}</p>
      </div>
      <div className="other-users">
        <h3>Other Users</h3>
        <ul>
        {otherUsers.map((user) => (
          <li className="versus-list" key={user.id}>
            <p>{user.name}</p>
            <button onClick={() => {
              socket.emit('join room', { currentUser, otherUser: user });
              setInRoom(true);
            }}>
              Défier
            </button>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default UserList;