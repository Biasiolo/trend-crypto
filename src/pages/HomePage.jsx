// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { SiBitcoin } from "react-icons/si";
import { SiBitcoincash } from "react-icons/si";
import CryptoTrend from '../components/CryptoTrend';
import Ranking from '../components/Ranking';
import Analyze from '../components/Analyze';
import SpotTrend from '../components/SpotTrend';
import SpotRanking from '../components/SpotRanking';
import SpotAnalyze from '../components/SpotAnalyze';
import CryptoNews from '../components/CryptoNews';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState('futures'); // Estado para o componente ativo

  const renderComponent = () => {
    switch (activeComponent) {
      case 'futures':
        return (
          <div key="futures">
            <Ranking />
            <Analyze />
            <CryptoTrend />
          </div>
        );
      case 'spot':
        return (
          <div key="spot">
            <SpotRanking />
            <SpotAnalyze />
            <SpotTrend />
          </div>
        );
      case 'news':
        return (
          <div key="news">
            <CryptoNews />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Header com Link para Home */}
      <div
        className="header bg-dark text-white text-center mt-3 p-4 rounded"
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveComponent('futures')}
      >
        <h1>
          <SiBitcoincash className="me-2" />
          Trend Crypto
          <SiBitcoin className="ms-2" />
        </h1>
        <p>Analyze rapid crypto trends for trading decisions.</p>
      </div>
{/* Botões de navegação */}
<div className="d-flex justify-content-center gap-2 my-4">
  <button
    className={`btn btn-outline-dark flex-grow-1 ${activeComponent === 'futures' ? 'active' : ''}`}
    style={{ maxWidth: '200px' }}
    onClick={() => setActiveComponent('futures')}
  >
    USD-M Futures
  </button>
  <button
    className={`btn btn-outline-dark flex-grow-1 ${activeComponent === 'spot' ? 'active' : ''}`}
    style={{ maxWidth: '200px' }}
    onClick={() => setActiveComponent('spot')}
  >
    Spot Market
  </button>
  <button
    className={`btn btn-outline-dark flex-grow-1 ${activeComponent === 'news' ? 'active' : ''}`}
    style={{ maxWidth: '200px' }}
    onClick={() => setActiveComponent('news')}
  >
    Crypto News
  </button>
  <button
    className="btn btn-outline-dark flex-grow-1"
    style={{ maxWidth: '200px' }}
    onClick={() => setActiveComponent('futures')}
  >
    Back to Home
  </button>
</div>


      {/* Renderização com transição */}
      <TransitionGroup className="mt-4">
        <CSSTransition
          key={activeComponent}
          classNames="fade"
          timeout={300} // Tempo da animação em ms
        >
          {renderComponent()}
        </CSSTransition>
      </TransitionGroup>

      {/* Estilos para transição */}
      <style>
        {`
          .fade-enter {
            opacity: 0;
            transform: translateY(20px);
          }
          .fade-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 300ms, transform 300ms;
          }
          .fade-exit {
            opacity: 1;
            transform: translateY(0);
          }
          .fade-exit-active {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 300ms, transform 300ms;
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
