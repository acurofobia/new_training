// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import RegisterComponent from '../components/RegisterComponent';
import ChangeComponent from '../components/ChangeComponent';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [regVisible, setRegVisible] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);

  const toggleRegVisibility = (setState) => {
    setRegVisible(!regVisible);
  };
  const handleToggle = (id) => {
    setActiveUserId(prev => (prev === id ? null : id));
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
      {users.map((user, index) => {
        return <div>
            <p key={user.id}>id - {user.id} username - {user.username}</p>
            <button onClick={() => handleToggle(user.id)}>Изменить</button>
            {activeUserId === user.id && (
              <ChangeComponent updateTable={fetchData} user={user} visible />
            )}
          </div>
      })}
      {/* <UsersTable></UsersTable> */}
      {/* <button onClick={() => onClick()}>1</button> */}
    </div>
  );
};

export default AdminPage;
