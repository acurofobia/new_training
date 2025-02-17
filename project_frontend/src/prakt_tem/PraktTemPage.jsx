import React from 'react'
import PraktTemQuestionButton from '../prakt_tem/PraktTemQuestionButton';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import { protected_fetch } from '../components/protected_fetch';

const PraktTemPage = () => {
  const [questionData, setQuestionData] = useState({});
  const [answered, setAnswered] = useState(false);
  const { state } = useLocation();
  let { question_number } = useParams();
  const org = state.org;
  const category = state.category;
  const type = state.type;
  let mode = 2;
  if (question_number==undefined){
    question_number = state.lastAnswered + 1;
    mode = 1;
  }
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  function shuffle(array) {
    const newArray = [...array]
    const length = newArray.length
  
    for (let start = 0; start < length; start++) {
      const randomPosition = Math.floor((newArray.length - start) * Math.random())
      const randomItem = newArray.splice(randomPosition, 1)
  
      newArray.push(...randomItem)
    }
  
    return newArray
  }

  const checkAndSend = (e) => {
    e.preventDefault();
    const answer_id = e.target.querySelector('input[name="answer"]:checked').id;
    const accessToken = localStorage.getItem('accessToken');
    setButtonLoading(true);
    protected_fetch(navigate ,"POST", "/api/add_result_pt", accessToken,
      {"org": org,
      "category": category,
      "question_number": question_number,
      "question_id": questionData.question_id,
      "mode": mode,
      "answer_id": answer_id}).then(
        function(result) {
          const right_answer = result.data.right_answer;
          formRef.current.querySelector(`#id${answer_id}`).classList.add("red");
          formRef.current.querySelector(`#id${right_answer}`).classList.add("green");
          console.log(formRef.current, "FormREF");
          setAnswered(true);
          setButtonLoading(false);
        },
        function(error){
          console.log(error, "ERR");
        }
      )
  }

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      protected_fetch(navigate, "GET", `/api/get_question_pt/${org}/${category}/${question_number}/${type}`, accessToken).then(
        function(result) {
          setQuestionData(result.data);
          setLoading(false);
          setAnswered(false); // сделать случайный порядок
        },
        function(err) {
          console.log(err, "ERR")
        }
      )
    }
    fetchData();
  },[location]);

  if (loading) return <div>Loading...</div>;

  return (
    <form ref={formRef} onSubmit={checkAndSend} key={question_number}>
      <h1>{type == "prakt" ? "Практическая" : "Тематическая"} задача № {question_number}</h1>
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
      <PraktTemQuestionButton answered={answered} question_number={question_number} org={org} category={category} mode={mode} type={type} buttonLoading={buttonLoading}></PraktTemQuestionButton>
    </form>
)}

export default PraktTemPage