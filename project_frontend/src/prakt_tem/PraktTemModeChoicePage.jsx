import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { defineOrg } from '../components/defineOrg';
import { protected_fetch } from '../components/protected_fetch';
import ModeQuestions from '../components/ModeQuestions';

const PraktTemModeChoicePage = () => {
  const {category} = useParams();
  const {org} = useParams();
  const [orgText, setOrgText] = useState("");
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [lastAnswered, setLastAnswered] = useState(0);
  const [barLength, setBarLength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setOrgText(defineOrg(org));
    const accessToken = localStorage.getItem('accessToken');
    protected_fetch(navigate, "GET",
      `/api/numbers_of_questions_pt/${org}/${category}`,
      accessToken
    ).then(
      function(result){
        const numbersOfQuestions = result.data.numbers;
        protected_fetch(navigate, "GET",
          `/api/get_last_question_pt/${org}/${category}`,
          accessToken
        ).then(
          function(result){
            setLastAnswered(result.data.last_answered);
            const lastQuestion = result.data.last_answered;
            if (lastQuestion == numbersOfQuestions.length) {
              setFinished(true);
            }
            setLoading(false);
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
          <Link to="questions_by_query" className='link_button' state={{org, category, lastAnswered}}>Перейти ко второму этапу</Link>
        </div>
      )
    }
  }
}

export default PraktTemModeChoicePage