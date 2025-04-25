import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import styles from "../styles/numbers_of_questions.module.css"
import { protected_fetch } from '../components/protected_fetch';
import { useNavigate } from 'react-router-dom';

const PraktTemNumbersOfQuestionsPage = () => {
  let {category} = useParams();
  let {org} = useParams();
  const navigate = useNavigate();

  const [numbersOfWrongPraktQuestions, setNumbersOfWrongPraktQuestions] = useState([]);
  const [numbersOfWrongTemQuestions, setNumbersOfWrongTemQuestions] = useState([]);

  const newIteration = () => {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "POST", `/api/flush_iteration_pt/${org}/${category}`, accessToken).then(
      function(result){
        console.log(result);
        navigate(`../train/${org}/categories/${category}/mode_pt`, {state: {org, category}});
      }
    )
  }

  useEffect(() =>  {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "GET", `/api/wrong_answers_pt/${org}/${category}`, accessToken).then(
      function(result){
        console.log(result);
        setNumbersOfWrongPraktQuestions(result.data.prakt_numbers)
        setNumbersOfWrongTemQuestions(result.data.tem_numbers)
      }
    )
  }, []);

  return (
    <div className={styles.div}>
      <h2>В этих вопросах вы допустили ошибки. Можете решить их заново.</h2>
      <h3>Практические задачи:</h3>
      <ul className={styles.ul}>
        {numbersOfWrongPraktQuestions.map(number => (
          <li key={number}>
            <Link className={`${styles.link_button} link_button`} to={`${number}`} state={{org: org, category: category, lastAnswered: number, type: "prakt"}}>{number}</Link>
          </li>
        ))}
      </ul>
      <h3>Тематические задачи:</h3>
      <ul className={styles.ul}>
        {numbersOfWrongTemQuestions.map(number => (
          <li key={number}>
            <Link className={`${styles.link_button} link_button`} to={`${number}`} state={{org: org, category: category, lastAnswered: number, type: "tem"}}>{number}</Link>
          </li>
        ))}
      </ul>
      <p>Если Вы допустили много ошибок и поработали над ними, можете закрепить свои знания повторным прохождением первого этапа нажав кнопку "Новая итерация"</p>
      <button onClick={newIteration} className='link_button'>Новая итерация</button>
      {/* <p>Если Вас устраивает результат, полученный на втором этапе, можете перходить ко третьему, нажав кнопку "Перейти к третьему этапу"</p>
      <Link to={"../../mode_third"} relative="path" state={{org: org, category: category}} className='link_button'>Перейти к третьему этапу</Link> */}
    </div>
   
  )
}

export default PraktTemNumbersOfQuestionsPage