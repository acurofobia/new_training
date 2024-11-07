// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    try {
      await axios.post('/api/register', { username, password });
      navigate('/login');
    } catch (err) {
      setError('User already exists or error in registration');
    }
  };

  return (
    <Form handleSubmitForm={ handleRegister } 
    username={ username } 
    password={ password } 
    setUsername={ setUsername }
    setPassword={ setPassword }
    type={ "Зарегистрироваться" }></Form>
  );
};

export default RegisterPage;
