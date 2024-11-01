import React, { useState } from 'react'
// import '../styles/homePage.css'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <nav className=" home-page-nav">
        <ul className=" home-page-nav-list">
          <li className=" home-page-nav-list-item">
            <Link to={'/admin'} className="button">Администрирование</Link>
          </li>
          <li className=" home-page-nav-list-item">
            <Link to={'/train'} className="button">Тренировка</Link>
          </li>
        </ul>
      </nav>
      {/* <h2>Регистрация</h2>
      <input type="text" placeholder="Имя пользователя" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={register}>Регистрация</button>

      <h2>Вход</h2>
      <input type="text" placeholder="Имя пользователя" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Войти</button>

      <h2>Защищенный ресурс</h2>
      <button onClick={getProtectedData}>Получить данные</button>
      
      <p>{message}</p> */}

    </div>
  );
}

export default HomePage