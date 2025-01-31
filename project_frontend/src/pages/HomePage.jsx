import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../layouts/MainLayout';


const HomePage = () => {
  const { userData, setUserData } = useContext(UserContext);

  return (
    <div>
      <nav>
        <ul className='ul'>
          <li>
            <Link className={userData.rights ? "link_button" : "link_button_disabled link_button"} to={'/admin'}>Администрирование</Link>
          </li>
          <li>
            <Link className='link_button' to={'/train'}>Тренировка</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage