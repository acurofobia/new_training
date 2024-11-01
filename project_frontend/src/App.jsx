import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TrainPage from './pages/TrainPage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';
import NumbersOfQuestionsPage from './pages/NumbersOfQuestionsPage';
import ProtectedRoute from './components/ProtectedRoute';
import QuestionPage from './pages/QuestionPage';
import './App.css';

const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage setAuth={setAuth} />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="train"
          element={
            <ProtectedRoute>
              <TrainPage />
            </ProtectedRoute>
          }/>
        <Route path="train/:org/categories" element={<CategoriesPage />} />
        <Route path="train/:org/categories/:category" element={<NumbersOfQuestionsPage />} />
        <Route path="train/:org/categories/:category/:questionNum" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
};

export default App