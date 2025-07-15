import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import Auth from './Auth';

function App() {

  const [serverResponse, setRes] = useState('');

  const getResponse = async () => {
    const reponse = await axios.get('/').then(res => {
      setRes(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="App">
      <button onClick={getResponse}>Test server</button>
      <p>{serverResponse}</p>
      <br />
      <br />
      <Auth></Auth>
    </div>
  );
}

export default App;
