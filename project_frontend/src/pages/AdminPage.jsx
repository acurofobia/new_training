// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UsersTable from '../components/usersTable';
import RegisterComponent from '../components/RegisterComponent';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [regVisible, setRegVisible] = useState(false);

  const toggleRegVisibility = (setState) => {
    setRegVisible(!regVisible);
  };
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

  useEffect(() => {
    
    fetchData();
  }, []);

  return (
    <div>
      <h2>Admin Pagee</h2>
      <button onClick={toggleRegVisibility}>Регистрация</button>
      {regVisible && (
        <RegisterComponent updateTable={fetchData}></RegisterComponent>
      )}
      {/* <Link className='link_button' to="/register">Регистрация</Link> */}
      {users.map(user => {
        return <p key={user.id}>id - {user.id} username - {user.username}</p>
      })}
      <UsersTable></UsersTable>
      <button onClick={() => onClick()}>1</button>
      
    </div>
  );
};

export default AdminPage;
