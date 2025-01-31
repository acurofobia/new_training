import React from 'react'
import { useEffect } from 'react'
import { protected_fetch } from '../components/protected_fetch';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const EndQuestionPage = () => {
  const [amountOfQuestions, setAmountOfQuestions] = useState("loading...");
  const [overallPoints, setOverallPoints] = useState("loading...");
  const [wrongAnswered, setWrongAnswered] = useState("loading...");
  const navigate = useNavigate();
  const { state } = useLocation();
  const org = state.org;
  const category = state.category;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "GET", `/api/test_summary/${org}/${category}`, accessToken).then(
      function(result){
        console.log(result.data)
        setAmountOfQuestions(result.data.amountOfQuestions);
        setOverallPoints(result.data.overallPoints);
        setWrongAnswered(result.data.amountOfQuestions - result.data.overallPoints);
      }
    )
  }, []);

  return (
    <div>
      <h1>Поздравляем</h1>
      <p>Вы решили {amountOfQuestions} тестовых вопросов</p>
      <p>Из них:</p>
      <p><strong>{overallPoints}</strong> правильно</p>
      <p><strong>{wrongAnswered}</strong> неправильно</p>
      <Link to={`../train/${org}/categories/${category}/mode/all_questions`} className='link_button'>Посмотреть ошибки</Link>
    </div>
  )
}

export default EndQuestionPage