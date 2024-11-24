// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SiBitcoin } from "react-icons/si";
import { SiBitcoincash } from "react-icons/si";
import CryptoTrend from '../components/CryptoTrend';
import Ranking from '../components/Ranking';
import Analyze from '../components/Analyze';

const HomePage = () => {
  return (
    <div className="container">
      <div className="bg-dark text-white text-center mt-3 p-4 rounded">
        <h1>
          <SiBitcoincash className="me-2" />  
          Trend Crypto
          <SiBitcoin className="ms-2" /> 
        </h1>
        <p>Analyze rapid crypto trends for trading decisions.</p>
      </div>

      <Ranking />
      <Analyze />
      <CryptoTrend />
    </div>
  );
};

export default HomePage;
