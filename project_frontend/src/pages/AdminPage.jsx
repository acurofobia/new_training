// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem('token');
  //     try {const response = await axios.get('http://127.0.0.1:5000/protected', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     return response.status;
  //     } catch (error) {
  //       navigate("/login_requiered");
  //     } 
  //   };
  //   fetchData();
  // }, []);

  return (
    <div>
      <h2>Admin Page</h2>
      {/* {data ? <p>{data.logged_in_as.username}</p> : <p>Loading...</p>} */}
    </div>
  );
};

export default AdminPage;
