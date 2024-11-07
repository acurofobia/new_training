import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <nav>
        <ul className='ul'>
          <li>
            <Link className='link_button' to={'/admin'}>Администрирование</Link>
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