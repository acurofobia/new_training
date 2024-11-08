import React from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import { refreshAccessToken } from '../components/refresh_logout';
import { definePoints } from '../components/definePoints';
import styles from "../styles/question.module.css"
import { defineColor } from '../components/defineColor';

const QuestionPage = () => {
  const [answer_number, setSelectedAnswer] = useState(0);
  const [itemColor, setItemColor] = useState({});
  const [answered, setAnswered] = useState(false);
  const { question_number } = useParams();
  const { state } = useLocation();
  const question = state.question;
  const org = state.org;
  const category = state.category;
  const navigate = useNavigate();

  const checkAndSend = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const points = definePoints(question, answer_number);
      const response = await axios.post(`/api/add_result`, {"org": org, 
        "category": category, 
        "question_number": question_number, 
        "answer_number": answer_number, 
        "points": points}, { headers: { Authorization: `Bearer ${accessToken}` } });
        setItemColor(defineColor(question, answer_number));
        setAnswered(true);
    } catch (error) {
      if (error.status == 401) {
        const result = await refreshAccessToken();
        if (result == "OK") {
          checkAndSend();
        } else {
          navigate(`${result}`);
        }
      } else {
        console.log(error);
      }
    }
  }

  const selectColor = (key) => {
    console.log(key, itemColor);
    const red = itemColor.red == key ? styles.red : "";
    const green = itemColor.green == key ? styles.green : "";
    return [red, green].join(" ");
  }

  return (
    <div>
      <h1>Вопрос № {question_number}</h1>
      <h3>{question.question}</h3>
      <ul>
        {Object.keys(question.answers).map(answerNum => {
          return <li 
          className={selectColor(answerNum)}
          key={answerNum}>
            <input onChange={() => setSelectedAnswer(answerNum)} type="radio" id={answerNum} name="answer" />
            <label htmlFor={answerNum}>{question.answers[answerNum].answer}</label>
          </li>
        })}
      </ul>
      {!answered && <button className={[styles.link_button, "link_button"].join(" ")} onClick={() => checkAndSend()}>Проверить и отправить</button>}
      {answered && <Link to={-1} className={[styles.link_button, "link_button"].join(" ")}>Назад к вопросам</Link>}
    </div>
  )
}

export default QuestionPage