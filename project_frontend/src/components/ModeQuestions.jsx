import React from 'react'
import { Link } from 'react-router-dom';
import "../styles/modeQuestions.css";

const ModeQuestions = ({props}) => {
  const org = props.org;
  const category = props.category;
  const lastAnswered = props.lastAnswered;

  return (
    <div>
      <h2>Инструкция</h2>
      <div>
        <h3>Первый этап</h3>
        <p>На первом этапе Вам необходимо решить все тестовые вопросы той категории которую вы выбрали. После решения тестовых вопросов Вам будет предложено перерешать те вопросы, в которых вы допустили ошибку.</p>
      </div>
      <div>
        <h3>Второй этап</h3>
        <p>На втором этапе Вам необходимо решить все практические и тематические задачи. Так-же как и в первом этапе в конце будет предложена работа над ошибками.</p>
      </div>
      <div>
        <h3>Третий этап</h3>
        <p>На третьем этапе Вам будет предложено пройти пробное тестирование, в котором будет 50 случайных тестовых вопросов, 2 случайные практические задачи и 3 тематические. Время прохождения теста будет ограничено 40 минутами, что сделает 3 этап максимально схожим с реальным прохожднием аттестации.</p>
      </div>
      {/* <div style={{width: "100%", height: "15px", background: "grey"}}>
      <div style={{width: `${barLength}%`, height: "100%", background: "lightgreen"}}></div>
      </div> */}
      <Link to="questions_by_query" className='link_button' state={{org, category, lastAnswered}}>Перейти к первому этапу</Link>
    </div>
  )
}

export default ModeQuestions