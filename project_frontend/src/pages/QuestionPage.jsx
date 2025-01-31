import React from 'react'
import QuestionButton from '../components/QuestionButton';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import { protected_fetch } from '../components/protected_fetch';

const QuestionPage = ({mode}) => {
  const [questionData, setQuestionData] = useState({});
  const [answered, setAnswered] = useState(false);
  let { question_number } = useParams();
  const { state } = useLocation();
  const org = state.org;
  const category = state.category;
  if (mode == "questions_by_query"){
    question_number = state.lastAnswered + 1;
  }
  const navigate = useNavigate();
  const location = useLocation();

  const formRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const checkAndSend = (e) => {
    e.preventDefault();
    const answer_id = e.target.querySelector('input[name="answer"]:checked').id;
    const accessToken = localStorage.getItem('accessToken');
    setButtonLoading(true);
    protected_fetch(navigate ,"POST", "/api/add_result", accessToken,
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
      setLoading(true);
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
    }
    fetchData();
  },[location]);

  if (loading) return <div>Loading...</div>;

  return (
    <form ref={formRef} onSubmit={checkAndSend} key={question_number}>
      <h1>Вопрос № {question_number}</h1>
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
      <QuestionButton answered={answered} mode={mode} question_number={question_number} org={org} category={category} buttonLoading={buttonLoading}></QuestionButton>
    </form>
  )
}

export default QuestionPage