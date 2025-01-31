import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import styles from "../styles/numbers_of_questions.module.css"
import { protected_fetch } from '../components/protected_fetch';
import { useNavigate } from 'react-router-dom';

const TestsComponent = () => {
  let {category} = useParams();
  let {org} = useParams();
  const navigate = useNavigate();

  const [numbersOfQuestions, setNumbersOfQuestions] = useState([]);

  const newIteration = () => {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "POST", `/api/flush_iteration/${org}/${category}`, accessToken).then(
      function(result){
        console.log(result);
        navigate(`../train/${org}/categories/${category}/mode`, {state: {org, category}});
      }
    )
  }

  useEffect(() =>  {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "GET", `/api/wrong_answers/${org}/${category}`, accessToken).then(
      function(result){
        setNumbersOfQuestions(result.data.numbers);
      }
    )
  }, []);

  return (
    <div className={styles.div}>
      <h2>В этих вопросах вы допустили ошибки. Можете решить их заново.</h2>
      <ul className={styles.ul}>
        {numbersOfQuestions.map(number => (
          <li key={number}>
            <Link className={`${styles.link_button} link_button`} to={`${number}`} state={{org: org, category: category, lastAnswered: number}}>{number}</Link>
          </li>
        ))}
      </ul>
      <p>Если Вы допустили много ошибок и поработали над ними, можете закрепить свои знания повторным прохождением первого этапа нажав кнопку "Новая итерация"</p>
      <button onClick={newIteration} className='link_button'>Новая итерация</button>
      <p>Если Вас устраивает результат, полученный на первом этапе, можете перходить ко второму, нажав кнопку "Перейти ко второму этапу"</p>
      <Link to={`/train/${org}/categories/${category}/mode_pt`} state={{org: org, category: category}} className='link_button'>Перейти ко второму этапу</Link>
    </div>
   
  )
}

export default TestsComponent