import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { defineOrg } from '../components/defineOrg';
import { protected_fetch } from '../components/protected_fetch';
import ModeQuestions from '../components/ModeQuestions';

const ModeChoicePage = () => {
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
      `/api/numbers_of_questions/${org}/${category}`,
      accessToken
    ).then(
      function(result){
        const numbersOfQuestions = result.data.numbers;
        protected_fetch(navigate, "GET",
          `/api/get_last_question/${org}/${category}`,
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
          <ModeQuestions props={{org, category, barLength, lastAnswered}}></ModeQuestions>
        </div>
      )
    }
  }
}

export default ModeChoicePage