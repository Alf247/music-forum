import { Routes, Route } from 'react-router-dom';
import './App.css';
import Auth from './Auth';
import Home from './Home';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </div>
  );
}

export default App;
