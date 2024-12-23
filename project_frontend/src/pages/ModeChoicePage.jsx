import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { defineOrg } from '../components/defineOrg';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { refreshAccessToken } from '../components/refresh_logout';

const ModeChoicePage = () => {
  const {category} = useParams();
  const {org} = useParams();
  const [orgText, setOrgText] = useState("")
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastAnswered, setLastAnswered] = useState(0);
  const [barLength, setBarLength] = useState(0);

  useEffect(() => {
    setBarLength(Math.ceil(lastAnswered / Object.keys(questions).length * 100));
  }, [lastAnswered, questions]);
  useEffect(() => console.log(Object.keys(questions).length), [questions]);

  const getLastAnswered = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`/api/get_last_question/${org}/${category}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setLastAnswered(response.data.last_answered);
      
    } catch (error) {
      if (error.status == 401) {
        const result = await refreshAccessToken();
        if (result == "OK") {
          getLastAnswered();
        } else {
          navigate(`${result}`);
        }
      } else {
        console.log(error);
      }
    }
  };

  const get_test = async () => {
    const response = await axios.get(`/api/get_test/${org}/${category}`);
    setQuestions(response.data.data);
    localStorage.setItem("questions", JSON.stringify(response.data.data));
    setLoading(false);
  };

  useEffect(() => {
    setOrgText(defineOrg(org));
    if (!localStorage.getItem("questions")){
      get_test();
    } else {
      setQuestions(JSON.parse(localStorage.getItem("questions")));
      setLoading(false);
    };
    getLastAnswered();
  }, [])

  return (
    <div>
      <p>Вы выбрали {orgText}</p>
      {loading ? <Spinner/> : null}
      <ul>
        <li>
          <Link to={`questions_by_query/${lastAnswered + 1}`} className='link_button' state={{org: org, category: category}}>
            <h3>Все вопросы по очереди</h3>
            {/* {lastAnswered}
            <p></p>
            {barLength}
            <p></p>
            {Object.keys(questions).length} */}
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, deleniti quod. Debitis necessitatibus labore, dolorum eum eveniet mollitia? Perspiciatis ea repellendus ad unde dolorum ipsum voluptatibus aspernatur magnam quas quasi?</p>
            <div style={{width: "100%", height: "15px", background: "grey"}}>
            <div style={{width: `${barLength}%`, height: "100%", background: "lightgreen"}}></div>
            </div>
            <button className='link_button'>Сброс итераций</button>
          </Link>
        </li>
        <li>
          <Link to={`all_questions`} className='link_button'>
            <h3>Посмотреть ошибки</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, deleniti quod. Debitis necessitatibus labore, dolorum eum eveniet mollitia? Perspiciatis ea repellendus ad unde dolorum ipsum voluptatibus aspernatur magnam quas quasi?</p>
          </Link>
        </li>
        <li>
          <Link className='link_button'>
            <h3>Пробное тестирование</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, deleniti quod. Debitis necessitatibus labore, dolorum eum eveniet mollitia? Perspiciatis ea repellendus ad unde dolorum ipsum voluptatibus aspernatur magnam quas quasi?</p>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default ModeChoicePage