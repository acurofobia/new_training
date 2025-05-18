import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TableComponent = ({ userId, category }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/generate_result/${userId}/${category}`);
        setData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке результатов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userId, category]);

  if (loading) return <p>Загрузка данных...</p>;
  if (!data) return <p>Нет данных</p>;

  return (
    <div>
      <h3>Результаты для: {data.full_name} (категория {category})</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Итерация</th>
            <th>Всего вопросов</th>
            <th>Правильно</th>
            <th>Процент</th>
            <th>Начало</th>
            <th>Конец</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((result, idx) => (
            <tr key={idx}>
              <td>{result.iteration}</td>
              <td>{result.test_overall}</td>
              <td>{result.test_passed}</td>
              <td>{result.percent.toFixed(2)}%</td>
              <td>{result.beginning_time}</td>
              <td>{result.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Практика, тематика</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Итерация</th>
            <th>Всего вопросов</th>
            <th>Правильно</th>
            <th>Процент</th>
            <th>Начало</th>
            <th>Конец</th>
          </tr>
        </thead>
        <tbody>
          {data.results_pt.map((result, idx) => (
            <tr key={idx}>
              <td>{result.iteration}</td>
              <td>{result.test_overall}</td>
              <td>{result.test_passed}</td>
              <td>{result.percent.toFixed(2)}%</td>
              <td>{result.beginning_time}</td>
              <td>{result.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;