import React from 'react'
import ThirdButton from './ThirdButton';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import { protected_fetch } from '../components/protected_fetch';
import { nextNumber } from './components/nextNumber';

const ThirdPage = () => {
  const [questionData, setQuestionData] = useState({});
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const { state } = useLocation();
  const randomQuestions = state.randomQuestions;

  let { type } = useParams();
  let { question_number_url } = useParams();
  let question_number = 0;
  const {category} = useParams();
  const {org} = useParams();
  
  const mode = 3;
  const location = useLocation();
  const formRef = useRef(null);
  const navigate = useNavigate();

  if (question_number_url == 0){ 
    question_number = randomQuestions.randomTestQuestions[0];
  } else {
    question_number = randomQuestions.randomTestQuestions[question_number_url];
  }


  const checkAndSend = (e) => {
    e.preventDefault();
    const answer_id = e.target.querySelector('input[name="answer"]:checked').id;
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate ,"POST", "/api/add_result_random", accessToken,
      {"org": org,
      "category": category,
      "question_number": question_number,
      "question_id": questionData.question_id,
      "mode": 3,
      "type": type,
      "answer_id": answer_id}).then(
        function(result) {
          const nextNumberResult = nextNumber(question_number_url, type, org)
          navigate(`/train/${org}/categories/${category}/mode_third/questions_by_query/${type}/${question_number_url}`, { state: { randomQuestions } });
        },
        function(error){
          console.log(error, "ERR");
        }
      )
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "GET", `/api/get_question/${org}/${category}/${question_number}`, accessToken).then(
      
      function(result) {
        setQuestionData(result.data);
        setLoading(false);
        setAnswered(false);
      }, 
      function(err) {
        console.log(err, "ERR")
      }
    )
  },[location]);

  if (loading) return <div>Loading...</div>;

  return (
    <form ref={formRef} onSubmit={checkAndSend} key={question_number}>
      <h1>{type == "prakt" ? "Практическая задача" : type == "tem" ? "Тематическая задача" : "Тестовый вопрос"} № {question_number}</h1>
      <h3 key={questionData.question_id}>{questionData["question"]}</h3>
      <ul>
        {questionData.answers.map(answer => {
          return <li id={`id${answer.id}`} key={answer.id}>
            <label>
              <input type="radio" id={answer.id} key={answer.id} name="answer" />
              {answer.answer}
            </label>
          </li>
        })}
      </ul>
      <button className={`${styles.link_button} link_button`} type='submit'>Следующий вопрос</button>
    </form>
)}

export default ThirdPage