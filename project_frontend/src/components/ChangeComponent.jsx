import React, { useState } from 'react';
import axios from 'axios';
import { protected_fetch } from './protected_fetch';
import { useNavigate } from 'react-router-dom'

const ChangeComponent = ({updateTable, user}) => {
  const navigate = useNavigate();
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
      "id": user.id,
      "username": data.username,
      "full_name": data.full_name,
      "org": data.org,
      "doc_number": data.doc_number,
      "password": data.password,
      "allowed_org": allowed_org,
      "allowed_categories": allowed_categories,
      "rights": rights
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      protected_fetch(navigate, "PATCH", "/api/change", accessToken, toSend).then(
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
      <input type="text" id='username' name='username' defaultValue={user.username}/>
      <label htmlFor="full_name">ФИО</label>
      <input type="text" id='full_name' name='full_name' defaultValue={user.full_name}/>
      <label htmlFor="org">Организация</label>
      <input type="text" id='org' name='org' defaultValue={user.org}/>
      <label htmlFor="doc_number">Номер договора</label>
      <input type="text" id='doc_number' name='doc_number' defaultValue={user.doc_number}/>
      <label htmlFor="password">Изменить пароль</label>
      <input type="password" id='password' name='password' />
      <fieldset>
        <legend>Выберите организации ОТБ:</legend>
        <div>
          <input type="checkbox" id="fda" name="fda_org" defaultChecked={user.allowed_org.includes("fda")}/>
          <label htmlFor="fda">ФДА</label>
        </div>
        <div>
          <input type="checkbox" id="fazt" name="fazt_org" defaultChecked={user.allowed_org.includes("fazt")}/>
          <label htmlFor="fazt">ФАЖТ</label>
        </div>
        <div>
          <input type="checkbox" id="favt_mos" name="favt_mos_org" defaultChecked={user.allowed_org.includes("favt_mos")}/>
          <label htmlFor="favt_mos">ФАВТ Москва</label>
        </div>
        <div>
          <input type="checkbox" id="favt_ul" name="favt_ul_org" defaultChecked={user.allowed_org.includes("favt_ul")}/>
          <label htmlFor="favt_ul">ФАВТ Ульяновск</label>
        </div>
        <div>
          <input type="checkbox" id="famrt" name="famrt_org" defaultChecked={user.allowed_org.includes("famrt")}/>
          <label htmlFor="famrt">ФАМРТ</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Выберите категории:</legend>
        {["1", "2", "3", "4", "5", "6", "7", "8"].map(number => {
          return <div key={number}>
          <input type="checkbox" id={`cat${number}`} name={`cat${number}`} defaultChecked={user.allowed_categories.includes(number)}/>
          <label htmlFor={`cat${number}`}>{number}</label>
          </div>
        })}
      </fieldset>
      <fieldset>
        <legend>Выберите полномочия:</legend>
        <div>
          <input type="checkbox" id="1" name="admin" defaultChecked={user.rights === 1}/>
          <label htmlFor="1">Администратор</label>
        </div>
        <div>
          <input type="checkbox" id="0" name="user" defaultChecked={user.rights === 0}/>
          <label htmlFor="0">Пользователь</label>
        </div>
      </fieldset>
      <button type="submit">Отправить</button>
    </form>
  )}

export default ChangeComponent