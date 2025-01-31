import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from '../layouts/MainLayout';

const CategoriesPage = () => {
  let {org} = useParams();
  const listOfCategories = [1,2,3,4,5,6,7,8];
  const { userData, setUserData } = useContext(UserContext);

  const checkClass = (category) => {    
    if (userData.allowed_categories.includes(category)){
      return "link_button"
    } else {
      return "link_button_disabled link_button"
    }
  }

  useEffect(() => {
    localStorage.removeItem("questions");
  }, []);

  return (
    <ul>
      {listOfCategories.map(category => 
        <li key={category}><Link className={checkClass(category.toString())} to={`/train/${org}/categories/${category}/mode`}>{`Категория ${category}`}</Link></li>
      )}
    </ul>
  )
}

export default CategoriesPage