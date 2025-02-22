import React from 'react'
import { Link } from 'react-router-dom'
import styles from "../styles/question.module.css"
import { useEffect, useState } from 'react'
import { protected_fetch } from './protected_fetch'
import axios from 'axios'

const QuestionButton = ({answered, mode, question_number, org, category, buttonLoading}) => {
  const [lastNumber, setLastNumber] = useState(<></>);
  console.log("IN BUTTON", mode, question_number)
  useEffect(() => {
    axios.get(`/api/numbers_of_questions/${org}/${category}`).then(
      function(data){
        setLastNumber(data.data.numbers.length);
      }
    )
  },[]);

  if (buttonLoading){
    return <button disabled className={`${styles.link_button} link_button`} type='submit'>Загрузка</button>
  }

  if (answered) {
    if (question_number == lastNumber && mode == "questions_by_query") {
      return <Link to={'end'} state={{org, category}} className={`${styles.link_button} link_button`}>Конец</Link> 
    }else {
      console.log(question_number, lastNumber);
    }
    if (mode == "questions_by_query") {
      return <Link to={`../questions_by_query`} relative="path" state={{org: org, category: category, lastAnswered: question_number}} className={`${styles.link_button} link_button`}>Следующий вопрос</Link>
    }
    if (mode == "all_questions") {
      return <Link to={-1} className={`${styles.link_button} link_button`}>Перейти к списку вопросов</Link>
    }
  }

  return (
    <button className={`${styles.link_button} link_button`} type='submit'>Проверить и отправить</button>
  )
}

export default QuestionButton