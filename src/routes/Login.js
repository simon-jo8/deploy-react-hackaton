import React, { useState } from 'react';
import  { useNavigate }  from 'react-router-dom';
import axios from "axios"

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useNavigate();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError(null);
    try {
      /*const response = await fetch('https://hp-api-iim.azurewebsites.net/auth/log-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // La connexion a réussi, rediriger l'utilisateur vers la page d'accueil
        history.push('/');
      } else {
        // La connexion a échoué, afficher un message d'erreur
        setError('Les informations d\'identification sont incorrectes.');
      }*/

      axios.post("https://hp-api-iim.azurewebsites.net/auth/log-in",{"name": username, "password": password})
      .then((e)=> window.location ="/game"
      )
      .catch((e)=> console.log(e))
    } catch (error) {
      console.error(error);
      setError('Une erreur est survenue lors de la connexion.');
    }
  }

  return (
    <div>
      <h1>Connexion</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Nom d'utilisateur:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <label>
          Mot de passe:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;