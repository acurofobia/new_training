import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from "../styles/numbers_of_questions.module.css"

const TestsComponent = () => {
  let {category} = useParams();
  let {org} = useParams();

  const [numbersOfQuestions, setNumbersOfQuestions] = useState([]);

  useEffect(() =>  {
    const fetchData = async () => {
      const response = await axios.get(`/api/numbers_of_questions/${org}/${category}`);
      setNumbersOfQuestions(response.data.numbers);
    }
    fetchData();
  }, []);

  return (
    <ul className={styles.ul}>
      {numbersOfQuestions.map(number => (
        <li key={number}>
          <Link className={[styles.link_button, "link_button"].join(" ")} to={`${number}`} state={{org: org, category: category}}>{number}</Link>
        </li>
      ))}
    </ul>
  )
}

export default TestsComponent