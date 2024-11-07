// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';

const LoginPage = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      setAuth(true);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  

  return (
    <Form handleSubmitForm={ handleLogin } 
    username={ username } 
    password={ password } 
    setUsername={ setUsername }
    setPassword={ setPassword }
    type={ "Войти" }></Form>
  );
};

export default LoginPage;
