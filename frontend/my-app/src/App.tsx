import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import CreateReview from './components/CreateReview';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/log' element={<CreateReview/>} />
      </Routes>
    </div>
  );
}

export default App;
