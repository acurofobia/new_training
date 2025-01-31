import React, { useState } from 'react'
import axios from 'axios'

const RegisterComponent = ({updateTable}) => {
  const [formData, setFormData] = useState()


  const onSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    let allowed_org = [];
    let allowed_categories = [];
    let rights = 0;
    for (let key in data){
      if(key.slice(-4) == "_org"){
        allowed_org.push(key.slice(0, -4))
      }
      if(key.slice(0, 3) == "cat"){
        allowed_categories.push(key.slice(-1))
      }
      if(key == "admin"){
        rights = 1;
      }
    }
    const toSend = {
      "username": data.username,
      "full_name": data.full_name,
      "org": data.org,
      "password": data.password,
      "allowed_org": allowed_org,
      "allowed_categories": allowed_categories,
      "rights": rights
    }
    try {
      axios.post('/api/register', toSend).then(
        function(result){
          console.log(result);
          updateTable();
          event.target.reset();
        }
      )
    } catch (err) {
      console.log('User already exists or error in registration');
    }
    
  }

  return (
    <form className='form' onSubmit={onSubmit}>
      <label htmlFor="username">Логин</label>
      <input type="text" id='username' name='username' />
      <label htmlFor="full_name">ФИО</label>
      <input type="text" id='full_name' name='full_name' />
      <label htmlFor="org">Организация</label>
      <input type="text" id='org' name='org' />
      <label htmlFor="password">Пароль</label>
      <input type="password" id='password' name='password' />
      <fieldset>
        <legend>Выберите организации ОТБ:</legend>
        <div>
          <input type="checkbox" id="fda" name="fda_org" />
          <label htmlFor="fda">ФДА</label>
        </div>
        <div>
          <input type="checkbox" id="fazt" name="fazt_org" />
          <label htmlFor="fazt">ФАЖТ</label>
        </div>
        <div>
          <input type="checkbox" id="favt_mos" name="favt_mos_org" />
          <label htmlFor="favt_mos">ФАВТ Москва</label>
        </div>
        <div>
          <input type="checkbox" id="favt_ul" name="favt_ul_org" />
          <label htmlFor="favt_ul">ФАВТ Ульяновск</label>
        </div>
      </fieldset>
      {/* <label htmlFor="allowed_categories">Категории</label> */}
      <fieldset>
        <legend>Выберите категории:</legend>
        {["1", "2", "3", "4", "5", "6", "7", "8"].map(number => {
          return <div key={number}>
          <input type="checkbox" id={`cat${number}`} name={`cat${number}`} />
          <label htmlFor={`cat${number}`}>{number}</label>
          </div>
        })}
      </fieldset>
      <fieldset>
        <legend>Выберите полномочия:</legend>
        <div>
          <input type="checkbox" id="1" name="admin" />
          <label htmlFor="1">Администратор</label>
        </div>
        <div>
          <input type="checkbox" id="0" name="user" />
          <label htmlFor="0">Пользователь</label>
        </div>
      </fieldset>
      <button type="submit">Отправить</button>
    </form>
  )
}

export default RegisterComponent