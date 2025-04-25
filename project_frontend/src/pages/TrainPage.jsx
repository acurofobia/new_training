// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../layouts/MainLayout';


const TrainPage = () => {
  const { userData, setUserData } = useContext(UserContext);

  const checkClass = (org) => {
    if (userData.allowed_org.includes(org)){
      return "link_button"
    } else {
      return "link_button_disabled link_button"
    }
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link className={checkClass("fda")} to="/train/fda/categories">ФДА</Link>
          </li>
          <li>
            <Link className={checkClass("favt_mos")} to="/train/favt_mos/categories">ФАВТ Москва</Link>
          </li>
          <li>
            <Link className={checkClass("favt_ul")} to="/train/favt_ul/categories">ФАВТ Ульяновск</Link>
          </li>
          <li>
            <Link className={checkClass("fazt")} to="/train/fazt/categories">ФАЖТ</Link>
          </li>
          <li>
            <Link className={checkClass("famrt")} to="/train/famrt/categories">ФАМРТ</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TrainPage;
