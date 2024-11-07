import React from 'react'
import { useForm } from 'react-hook-form';
import "../styles/form.css"

const Form = ({ handleSubmitForm, username, password, setUsername, setPassword, type }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form className='form' onSubmit={handleSubmit(handleSubmitForm)}>
      <label htmlFor="username">Логин</label>
      <input className='input' type="text" id='username' value={username} 
        {...register("username", {required: true, pattern: /^([A-Za-z0-9]){1,10}$/gm})} 
        onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="username">{errors.username && "Логин 1-10 символов, латинские буквы и цифры"}</label>
      <label htmlFor="password">Пароль</label>
      <input type="password" id='password' value={password} 
        {...register("password", {required: true, pattern: /^([A-Za-z0-9]){1,10}$/gm})}
        onChange={(e) => setPassword(e.target.value)} />
      <label htmlFor="password">{errors.password && "Пароль 1-10 символов, латинские буквы и цифры"}</label>
      <button type="submit">{ type }</button>
    </form>
  )
}

export default Form