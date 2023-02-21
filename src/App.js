import React from 'react';
import './App.css';
import Home from './Home/HomePage';
import UserList from './Home/UserList';




function App(){
  return(
    <div className='app mt-5'>
      <h1>Hogwart's Quiz</h1>
      <Home />
      <UserList />
    </div>
  )
}

export default App;