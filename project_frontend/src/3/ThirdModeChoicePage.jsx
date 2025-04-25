import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { protected_fetch } from '../components/protected_fetch';

const ThirdModeChoicePage = () => {
  const {category} = useParams();
  const {org} = useParams();
  const [randomQuestions, setRandomQuestion] = useState({});
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const randomQuestionsElement = <div>
    <h3>Вы сгенерировали вопросы!</h3>
    <h4>Тестовые номера вопросов:</h4>
    <p>{randomQuestions.randomTestQuestions}</p>
    <h4>Номера тематических задач:</h4>
    <p>{randomQuestions.randomTemQuestions}</p>
    <h4>Номера практических задач:</h4>
    <p>{randomQuestions.randomPraktQuestions}</p>
    <Link to={`questions_by_query/test/0`} className='link_button' state={{randomQuestions}}>Начать выполнение тестов</Link>
  </div>


  const generate = () => {
    protected_fetch(navigate, "GET", `/api/generate/${org}/${category}`, localStorage.getItem('accessToken')).then(
      function(result){
        setRandomQuestion(result.data);
        setLoaded(true);
      }
    )
  }

  return (
    <div>
      <h2>Инструкция</h2>
      <div>
        <h3>Третий этап</h3>
        <p>Это пробная аттестация. Вам будет предложено решить 50 случайных тестовых вопросов, 2 практические и 3 тематические задачи.</p>
      </div>
      <div>
        <p>Нажмите на кнопку ниже чтобы сгенерировать случайные номера вопросов, на которые вам предстоит ответить.</p>
        {loaded ? "" : <button onClick={generate} className='link_button'>Сгенерировать</button>}
      </div>
      {loaded ? randomQuestionsElement : ""}
      {/* <Link to="questions_by_query" className='link_button' state={{org, category, lastAnswered: lastAnswered.lastAnswered, type:lastAnswered.type}}>Перейти к третьему этапу</Link> */}
    </div>
  )
}

export default ThirdModeChoicePage