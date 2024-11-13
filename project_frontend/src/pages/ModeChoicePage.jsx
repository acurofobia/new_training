import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { defineOrg } from '../components/defineOrg';
import axios from 'axios';
import Spinner from '../components/Spinner';

const ModeChoicePage = () => {
  const {category} = useParams();
  const {org} = useParams();
  const [orgText, setOrgText] = useState("")
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrgText(defineOrg(org));
    const fetchData = async () => {
      const response = await axios.get(`/api/get_test/${org}/${category}`);
      setQuestions(response.data.data);
      localStorage.setItem("questions", JSON.stringify(response.data.data));
      setLoading(false);
    };
    if (!localStorage.getItem("questions")){
      fetchData();
      
    } else {
      setQuestions(JSON.parse(localStorage.getItem("questions")));
      setLoading(false);
    }
  }, [])


  return (
    <div>
      <p>Вы выбрали {orgText}</p>
      {loading ? <Spinner/> : null}
      <ul>
        <li>
          <Link to={`questions_by_query/1`} className='link_button' state={{questions: questions, org: org, category: category}}>
            <h3>Все вопросы по очереди</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, deleniti quod. Debitis necessitatibus labore, dolorum eum eveniet mollitia? Perspiciatis ea repellendus ad unde dolorum ipsum voluptatibus aspernatur magnam quas quasi?</p>
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