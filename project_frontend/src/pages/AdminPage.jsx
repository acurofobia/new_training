// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UsersTable from '../components/usersTable';

const AdminPage = () => {

  const onClick = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/api/get_users", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <div>
      <h2>Admin Page</h2>
      <UsersTable></UsersTable>
      <button onClick={() => onClick()}>1</button>
    </div>
  );
};

export default AdminPage;
