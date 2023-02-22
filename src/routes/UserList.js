import React, { useEffect, useState,useContext } from 'react';
import { io } from 'socket.io-client';
import '../Home/UserList.css';
import MainQuizz from "../game/MainQuizz";
import {SocketContext} from '../context/socket';



function UserList() {
  const socket = useContext(SocketContext);
  const [currentUser, setCurrentUser] = useState({});
  const [otherUsers, setOtherUsers] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [challengedPopup, setChallengedPopup] = useState(false);
  const [opponent, setOpponent] = useState({});
  let [inRoom, setInRoom] = useState(false);
  const [showGame,setShowGame] = useState(false);

  const showPopUp = () => {
    setChallengedPopup(true)
  }

    socket.on('connect', () => {
        setCurrentUser({ id: socket.id, name: `User ${socket.id}`, socket:socket });
    });

    socket.on('user connected', (connectedUsers) => {
      let _connectedUsers = connectedUsers;
      _connectedUsers = _connectedUsers.filter((user) => user.id !== socket.id);
      setOtherUsers(_connectedUsers);
      console.log('Connected users: ', _connectedUsers)
    });

    socket.on('user disconnected', (disconnectedUserId) => {
      setOtherUsers((prevUsers) => prevUsers.filter((user) => user.id !== disconnectedUserId));
    });



    // Emit an event to request the current user information from the server
    socket.emit('get current user', (currentUser) => {
      setCurrentUser(currentUser);
    });

    socket.on('room created', (roomId) => {
      // Redirect to the new room using the window.location object
      // window.location = `/game/${room}/`;
      setRoomId(roomId);
      console.log('room created');
      setShowGame(true);
    });

    socket.on('challenged', (opponent) => {
      setOpponent({ id: opponent, name: `User ${opponent}`,socket:socket });
      showPopUp();
    });





  return (
        showGame ? (<MainQuizz currentUser={currentUser.id} opponent={opponent.id} roomId={roomId} socket={socket}/>
            )
            : (<div className="user-list-container">
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
                        <p>{user.id}</p>
                        <button onClick={() => {
                          socket.emit('challenge', user.id, currentUser.id);
                          // socket.emit('join room', { currentUser, otherUser: user });
                          // setInRoom(true);
                        }}>
                          Défier
                        </button>
                      </li>
                  ))}
                </ul>
              </div>
              {challengedPopup
                  ? (<div className="popup">
                    <p>Vous avez été défier</p>
                    <button onClick={() => {
                      socket.emit('challenge user', opponent.id);
                      setChallengedPopup(false);
                    }}>Accepter</button>
                  </div>)
                  : null
              }
            </div>)
  );
}

export default UserList;