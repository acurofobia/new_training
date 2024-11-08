import React from 'react'
import { Link } from 'react-router-dom'
import styles from "../styles/login_requiered.module.css"

const LoginRequired = () => {
  return (
    <div className={styles.wrapper}>
      <h1>LoginRequired</h1>
      <Link className='link_button' to={'/login'}>login</Link>
    </div>
    
  )
}

export default LoginRequired