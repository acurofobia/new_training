import React from 'react'
import { Link } from 'react-router-dom'

const LoginRequired = () => {
  return (
    <>
      <div>LoginRequired</div>
      <Link to={'/login'}>login</Link>
    </>
    
  )
}

export default LoginRequired