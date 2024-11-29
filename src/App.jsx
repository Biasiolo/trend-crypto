// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage defaultSection="futures" />} />
        <Route path="/futures" element={<HomePage defaultSection="futures" />} />
        <Route path="/spot" element={<HomePage defaultSection="spot" />} />
        <Route path="/crypto-news" element={<HomePage defaultSection="crypto-news" />} />
      </Routes>
    </Router>
  );
};

export default App;
