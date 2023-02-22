import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APICall = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://hp-api-iim.azurewebsites.net/users');
        console.log(response);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  return (      
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
  );
};

export default APICall;