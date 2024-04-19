import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Board from './components/board';
import CreateBoard from './components/createBoard';
import Home from './pages/home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-board" element={<CreateBoard />} />
      <Route path="/boards/:uuid" element={<Board />} />
    </Routes>
  );
};

export default App;
