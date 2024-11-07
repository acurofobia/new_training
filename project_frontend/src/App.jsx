import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TrainPage from './pages/TrainPage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';
import NumbersOfQuestionsPage from './pages/NumbersOfQuestionsPage';
import LoginRequired from './pages/LoginRequired';
import ProtectedRoute from './components/ProtectedRoute';
import QuestionPage from './pages/QuestionPage';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    if (savedAccessToken && savedRefreshToken) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      setAuth(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login_requiered" element={<LoginRequired />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage 
                                      setAuth={setAuth} />} />
        <Route path="admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>}/>
        <Route path="train" element={<ProtectedRoute><TrainPage /></ProtectedRoute>}/>
        <Route path="train/:org/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="train/:org/categories/:category" element={<ProtectedRoute><NumbersOfQuestionsPage /></ProtectedRoute>} />
        <Route path="train/:org/categories/:category/:question_number" element={<ProtectedRoute><QuestionPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App