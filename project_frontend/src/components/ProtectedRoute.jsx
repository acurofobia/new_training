import React from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout',{}, { headers: { Authorization: `Bearer ${refreshToken}` } });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate("/login_requiered", {replace: true});
    } catch (error) {
      console.error("Logout failed", error);
      navigate("/login_requiered", {replace: true});
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/refresh', {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
      localStorage.setItem('accessToken', response.data.access_token);
      console.log(children, 'IN REFRESH')
    } catch (error) {
      console.error("Token refresh failed", error);
      handleLogout();
    }
  };

  const fetchData = async () => {
    // const accessToken = localStorage.getItem('accessToken');
    try {const response = await axios.get('/api/protected', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log(response)
    console.log(children, 'IN FETCH')
    } catch (error) {
      console.log('watch here', error);
      if (error.status == 422) {
        navigate("/login_requiered", {replace: true});
      } else {
        console.log('go in refresh')
        refreshAccessToken();
      }
    } 
  };
  fetchData();
  return children;
}

export default ProtectedRoute