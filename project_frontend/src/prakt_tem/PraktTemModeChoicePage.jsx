import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { protected_fetch } from '../components/protected_fetch';

const PraktTemModeChoicePage = () => {
  const {category} = useParams();
  const {org} = useParams();
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [lastAnswered, setLastAnswered] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "GET",
      `/api/numbers_of_questions_pt/${org}/${category}`,
      accessToken
    ).then(
      function(result){
        const praktNumbersOfQuestions = result.data.praktNumbers;
        const temNumbersOfQuestions = result.data.temNumbers;
        protected_fetch(navigate, "GET",
          `/api/get_last_question_pt/${org}/${category}`,
          accessToken
        ).then(
          function(result){
            
            setLastAnswered({"lastAnswered": result.data.last_answered, "type": result.data.type})
            if (result.data.last_answered == praktNumbersOfQuestions.length) {
              setLastAnswered({"lastAnswered": 0, "type": "tem"})
            }
            if (result.data.type == "tem" && result.data.last_answered == temNumbersOfQuestions.length){
              setFinished(true);
            }
            setLoading(false);
            console.log(lastAnswered);
          }
        )
      }
    )
  }, [])

  if (loading) {
    return <>Загрузка...</>
  } else {
    if (finished) {
      navigate('questions_by_query/end', {state: {org, category}});
    } else {
      return (
        <div>
          <h2>Инструкция</h2>
          <div>
            <h3>Второй этап</h3>
            <p>На втором этапе Вам необходимо решить все практические и тематические задачи. Так-же как и в первом этапе в конце будет предложена работа над ошибками.</p>
          </div>
          {/* <div style={{width: "100%", height: "15px", background: "grey"}}>
          <div style={{width: `${barLength}%`, height: "100%", background: "lightgreen"}}></div>
          </div> */}
          <Link to="questions_by_query" className='link_button' state={{org, category, lastAnswered: lastAnswered.lastAnswered, type:lastAnswered.type}}>Перейти ко второму этапу</Link>
        </div>
      )
    }
  }
}

export default PraktTemModeChoicePage