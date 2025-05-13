// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import RegisterComponent from '../components/RegisterComponent';
import ChangeComponent from '../components/ChangeComponent';
import TableComponent from '../components/TableComponent';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [regVisible, setRegVisible] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [selectedCategoryByUser, setSelectedCategoryByUser] = useState({}); // 👈

  const toggleRegVisibility = (setState) => {
    setRegVisible(!regVisible);
  };
  const handleToggle = (id) => {
    setActiveUserId(prev => (prev === id ? null : id));
  };

  const handleCategoryClick = (userId, category) => {
    setSelectedCategoryByUser(prev => ({
      ...prev,
      [userId]: prev[userId] === category ? null : category
    }));
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
        return <div key={user.id+"1"}>
            <p key={user.id}>id - {user.id} username - {user.username}</p>
            <button key={user+"change_button"} onClick={() => handleToggle(user.id)}>Изменить</button>
            {user.allowed_categories.map((category) => (
            <button
              key={user.id + "_category_" + category}
              onClick={() => handleCategoryClick(user.id, category)}
            >
              Категория {category}
            </button>
          ))}
            {activeUserId === user.id && (
              <ChangeComponent updateTable={fetchData} user={user} visible />
            )}
            {selectedCategoryByUser[user.id] && (
              <TableComponent userId={user.id} category={selectedCategoryByUser[user.id]} />
            )}
          </div>
      })}
      {/* <UsersTable></UsersTable> */}
      {/* <button onClick={() => onClick()}>1</button> */}
    </div>
  );
};

export default AdminPage;
