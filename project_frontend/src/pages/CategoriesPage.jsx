import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const CategoriesPage = () => {
  let {org} = useParams();
  const listOfCategories = [1,2,3,4,5,6,7,8];

  useEffect(() => {
    localStorage.removeItem("questions");
  }, []);

  return (
    <ul>
      {listOfCategories.map(category => 
        <li key={category}><Link className='link_button' to={`/train/${org}/categories/${category}`}>{`Категория ${category}`}</Link></li>
      )}
    </ul>
  )
}

export default CategoriesPage