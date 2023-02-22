import React from 'react';
import '../App.css';
import MainQuizz from "../game/MainQuizz";
import UserList from "./UserList";
import {SocketContext, socket} from '../context/socket';



export default function App(){
    return(
        <SocketContext.Provider value={socket}>
            <div className='app mt-5'>
                <UserList/>
            </div>
        </SocketContext.Provider>
    )
}
