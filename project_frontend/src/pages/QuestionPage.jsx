import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useState } from 'react';

const QuestionPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(0);
  const { questionNum } = useParams();
  const { state } = useLocation();
  const question = state.question;
  return (
    <div>
      <h1>QuestionPage {questionNum}</h1>
      <h2>{question.question}</h2>
      <ul>
        {Object.keys(question.answers).map(answerNum => {
          return <li key={answerNum}>
            <input onChange={() => setSelectedAnswer(answerNum)} type="radio" id={answerNum} name="answer" />
            <label htmlFor={answerNum}>{question.answers[answerNum].answer}</label>
          </li>
        })}
      </ul>
      {selectedAnswer}
    </div>
  )
}

export default QuestionPage