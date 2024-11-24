// eslint-disable-next-line no-unused-vars
import React from 'react';
import CryptoTrend from '../components/CryptoTrend';
import Ranking from '../components/Ranking';
import Analyze from '../components/Analyze';

const HomePage = () => {
  return (
    <div className="container">
        <div className="bg-dark text-white p-4 rounded">
        <h1 >Welcome to Trend Crypto</h1>
        <p>Analyze rapid crypto trends for trading decisions.</p>
        </div>
      
      <Ranking />
      <Analyze />
      <CryptoTrend />
      
    </div>
  );
};

export default HomePage;
