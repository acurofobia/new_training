import React from 'react'
import axios from 'axios';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { definePoints } from '../components/definePoints';
import { defineColor } from '../components/defineColor';
import { protected_fetch } from '../components/protected_fetch';
import styles from "../styles/question.module.css"

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

  const checkAndSend = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    const data = protected_fetch(navigate ,"POST", "/api/add_result", accessToken, {"org": org, 
      "category": category, 
      "question_number": question_number, 
      "answer_number": answer_number});
    // setItemColor(defineColor(question, answer_number));
    setAnswered(true);
    console.log(data);
  }

  useEffect(() => {
    setAnswered(false);
    setItemColor({});
    console.log("Data ID changed:", question_number);
  }, [question_number]);

  useEffect(() => {
    const fetchData = async () => {
      const response = protected_fetch(navigate, "GET", `/api/get_question/${org}/${category}/${question_number}`)
      console.log(response.data, "HERE");
    }
    fetchData();
  },[]);

  const selectColor = (key) => {
    console.log(key, itemColor);
    const red = itemColor.red == key ? styles.red : "";
    const green = itemColor.green == key ? styles.green : "";
    return [red, green].join(" ");
  }

  return (
    <form onSubmit={checkAndSend} key={question_number}>
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
      {!answered && <button className={[styles.link_button, "link_button"].join(" ")} type='submit'>Проверить и отправить</button>}
      {(answered && mode == "questions_by_query") && <Link to={`../${parseInt(question_number) + 1}`} relative="path" state={{questions: questions, org: org, category: category}} className={[styles.link_button, "link_button"].join(" ")}>Следующий вопрос</Link>}
      {(answered && mode == "all_questions") && <Link to={-1} className={[styles.link_button, "link_button"].join(" ")}>Перейти к списку вопросов</Link>}
    </form>
  )
}

export default QuestionPage