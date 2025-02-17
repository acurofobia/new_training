import React from 'react'
import { useEffect } from 'react'
import { protected_fetch } from '../components/protected_fetch';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PraktTemEndQuestionPage = () => {
  const [amountOfPraktQuestions, setAmountOfPrakQuestions] = useState("loading...");
  const [amountOfTemQuestions, setAmountOfTemQuestions] = useState("loading...");
  const [overallPoints, setOverallPoints] = useState("loading...");
  const navigate = useNavigate();
  const { state } = useLocation();
  const org = state.org;
  const category = state.category;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "GET", `/api/test_summary_pt/${org}/${category}`, accessToken).then(
      function(result){
        console.log(result.data)
        setAmountOfPrakQuestions(result.data.amountOfPraktQuestions);
        setAmountOfTemQuestions(result.data.amountOfTemQuestions);
        setOverallPoints(result.data.overallPoints);
      }
    )
  }, []);

  return (
    <div>
      <h1>Поздравляем</h1>
      <p>Вы решили {amountOfPraktQuestions} практических вопросов и</p>
      <p>Вы решили {amountOfTemQuestions} тематических вопросов</p>
      <p>Результат:</p>
      <p>Набранно баллов <strong>{overallPoints}</strong></p>
      <p>Из возможных <strong>{amountOfPraktQuestions*20+amountOfTemQuestions*10}</strong> баллов</p>
      <Link to={`../train/${org}/categories/${category}/mode/all_questions_pt`} className='link_button'>Посмотреть ошибки</Link>
    </div>
  )
}

export default PraktTemEndQuestionPage