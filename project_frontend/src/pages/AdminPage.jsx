// src/components/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get('http://127.0.0.1:5000/protected', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setData(response.data);
  //   };
  //   fetchData();
  // }, []);

  return (
    <div>
      <h2>Admin Page</h2>
      {/* {data ? <p>{data.logged_in_as.username}</p> : <p>Loading...</p>} */}
    </div>
  );
};

export default AdminPage;
