import React from 'react';
import '../App.css';
import MainQuizz from "../game/MainQuizz";
import UserList from "./UserList";


export default function App(){
    return(
        <div className='app mt-5'>
            <UserList/>
        </div>
    )
}
