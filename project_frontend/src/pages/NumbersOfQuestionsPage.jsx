import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TestsComponent = () => {
  let {category} = useParams();
  let {org} = useParams();

  const [questions, setQuestions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://127.0.0.1:5000/get_test/${org}/${category}`);
      setQuestions(response.data.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <ul>
        {Object.keys(questions).map(question => 
          <li key={question}>
            <Link to={`${question}`} state={{question: questions[question]}}>{question}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default TestsComponent