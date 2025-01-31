import React from 'react'
import { createContext ,useState } from 'react';
import { Outlet, useParams, Link } from "react-router-dom";
import "../styles/header.css";
import { protected_fetch } from '../components/protected_fetch';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export const UserContext = createContext(null);


const MainLayout = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);
  const [userData, setUserData] = useState({username:"",
    full_name:"",
    org:"",
    rights:0,
    allowed_org:[],
    allowed_categories:[],
  });
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    protected_fetch(navigate, "GET",
      "/api/user_info",
      accessToken
    ).then(
      function(result){
        setUserData({
          username: result.data.username,
          full_name: result.data.full_name,
          org: result.data.org,
          rights: result.data.rights,
          allowed_org: result.data.allowed_org,
          allowed_categories: result.data.allowed_categories
        });
        console.log(userData.allowed_org)
      }
    )
    
  }, [location.pathname]);

  const toggleRegVisibility = (setState) => {
    setInfoVisible(!infoVisible);
  };
  const { org, category } = useParams();

  const exit = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setUserData({username:"",
      full_name:"",
      org:"",
      rights:0,
      allowed_org:[],
      allowed_categories:[],
    });
  }

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <div>
        <button onClick={toggleRegVisibility}>User</button>
        {infoVisible && authenticated && (
          <div>
            <p>Имя пользователя: <strong>{userData.username}</strong></p>
            <p>ФИО: <strong>{userData.full_name}</strong></p>
            <p>Организация: <strong>{userData.org}</strong></p>
            <p>Права: <strong>{userData.rights}</strong></p>
            <p>Организация СОТБ: <strong>{userData.allowed_org.join(", ")}</strong></p>
            <p>Разрешенные категории: <strong>{userData.allowed_categories.join(", ")}</strong></p>
            <button onClick={exit}>Выйти</button>
          </div>
        )}
        <header className='header'>
          <Link to={"/"}>В начало</Link>
          {category ? <Link to={"../train"}>Организации</Link> : null}
          {category ? <Link to={`../train/${org}/categories`}>Категории</Link> : null}
          {/* <Link to={"../train"}>Категории</Link> */}
        </header>
        <main>
          <Outlet data={userData}></Outlet>
        </main>
      </div>
    </UserContext.Provider>
  )
}

export default MainLayout