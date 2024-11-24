// eslint-disable-next-line no-unused-vars
import React from 'react';
import CryptoTrend from '../components/CryptoTrend';

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to Trend Crypto</h1>
      <p>Analyze rapid crypto trends for trading decisions.</p>
      <CryptoTrend />
    </div>
  );
};

export default HomePage;
