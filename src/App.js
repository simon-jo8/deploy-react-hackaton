import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from ".//pages/LoginPage";
import HomePage from ".//pages/HomePage";
import RegisterPage from ".//pages/RegisterPage";

function App() {
  const isLoggedIn = false;
  
  return (
    <Routes>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/register" />} />
    </Routes>
  );
}

export default App;