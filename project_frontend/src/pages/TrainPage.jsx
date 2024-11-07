// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';

const TrainPage = () => {
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://127.0.0.1:5000/protected', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setData(response.data);
  //   };
  //   fetchData();
  // }, []);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link className='link_button' to="/train/fda/categories">ФДА</Link>
          </li>
          <li>
            <Link className='link_button' to="/train/favt_mos/categories">ФАВТ Москва</Link>
          </li>
          <li>
            <Link className='link_button' to="/train/favt_ul/categories">ФАВТ Ульяновск</Link>
          </li>
          <li>
            <Link className='link_button' to="/train/fazt/categories">ФАЖТ</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TrainPage;
