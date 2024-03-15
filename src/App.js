import logo from './logo.svg';
import { Route, Routes, useNavigate} from 'react-router-dom';
import Header from './components/header/index'
import Home from './pages/home/index'
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <div className='body-content'>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
