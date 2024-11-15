// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UsersTable from '../components/usersTable';

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData  = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("/api/get_users", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, []);

  return (
    <div>
      <h2>Admin Page</h2>
      <Link className='link_button' to="/register">Регистрация</Link>
      {users.map(user => {
        return <p key={user.id}>id - {user.id} username - {user.username}</p>
      })}
      <UsersTable></UsersTable>
      <button onClick={() => onClick()}>1</button>
      
    </div>
  );
};

export default AdminPage;
