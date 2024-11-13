import React from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken } from '../components/refresh_logout';
import { definePoints } from '../components/definePoints';
import styles from "../styles/question.module.css"
import { defineColor } from '../components/defineColor';

const QuestionPage = ({mode}) => {
  const [answer_number, setSelectedAnswer] = useState(0);
  const [itemColor, setItemColor] = useState({});
  const [answered, setAnswered] = useState(false);
  const { question_number } = useParams();
  const { state } = useLocation();
  const questions = state.questions;
  const question = questions[question_number];
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

  useEffect(() => {
    setAnswered(false);
    setItemColor({});
    console.log("Data ID changed:", question_number);
  }, [question_number]);

  const selectColor = (key) => {
    console.log(key, itemColor);
    const red = itemColor.red == key ? styles.red : "";
    const green = itemColor.green == key ? styles.green : "";
    return [red, green].join(" ");
  }

  return (
    <div key={question_number}>
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
      {(answered && mode == "questions_by_query") && <Link to={`../${parseInt(question_number) + 1}`} relative="path" state={{questions: questions, org: org, category: category}} className={[styles.link_button, "link_button"].join(" ")}>Следующий вопрос</Link>}
      {(answered && mode == "all_questions") && <Link to={-1} className={[styles.link_button, "link_button"].join(" ")}>Перейти к списку вопросов</Link>}
    </div>
  )
}

export default QuestionPage