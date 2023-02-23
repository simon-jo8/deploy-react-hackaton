import React from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici la logique pour enregistrer l'utilisateur
  };

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <p>
        Déjà inscrit ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}

export default RegisterPage;