import React from 'react'
import { useParams, Link } from 'react-router-dom'

const CategoriesPage = () => {
  let {org} = useParams();
  const listOfCategories = [1,2,3,4,5,6,7,8];

  return (
    <>
      {listOfCategories.map(category => 
        <li key={category}><Link to={`/train/${org}/categories/${category}`}>{`Категория ${category}`}</Link></li>
      )}
    </>
  )
}

export default CategoriesPage