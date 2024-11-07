import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from "../styles/numbers_of_questions.module.css"

const TestsComponent = () => {
  let {category} = useParams();
  let {org} = useParams();

  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/get_test/${org}/${category}`);
      setQuestions(response.data.data);
    };
    fetchData();
  }, []);

  return (
    <ul className={styles.ul}>
      {Object.keys(questions).map(question => 
        <li key={question}>
          <Link className={[styles.link_button, "link_button"].join(" ")} to={`${question}`} state={{question: questions[question], org: org, category: category}}>{question}</Link>
        </li>
      )}
    </ul>
  )
}

export default TestsComponent