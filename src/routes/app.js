import React, { useState, useEffect } from 'react';
import '../App.css';
import MainQuizz from "../game/MainQuizz";
import UserList from "./UserList";

import Login from './Login';
import {SocketContext, socket} from '../context/socket';


export default function App(){

    const [isLoggedIn, setIsLoggedIn] = useState('');

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté (par exemple, en vérifiant le jeton d'authentification)
        const isLoggedIn = checkIfLoggedIn();
        setIsLoggedIn(isLoggedIn);
    }, []);

    function checkIfLoggedIn() {
        // Vérifiez si l'utilisateur est connecté ici (par exemple, en vérifiant le jeton d'authentification)
        // Renvoie true s'il est connecté, false sinon
        return false; // Remplacez par votre propre logique de connexion
    }

    return(
        <div className='app mt-5'>
            {isLoggedIn ? (
                <UserList/>
            ) : (
                <Login />
            )}
        </div>

    )
}