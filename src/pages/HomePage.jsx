// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { SiBitcoin } from "react-icons/si";
import { SiBitcoincash } from "react-icons/si";
import CryptoTrend from '../components/CryptoTrend';
import Ranking from '../components/Ranking';
import Analyze from '../components/Analyze';
import SpotTrend from '../components/SpotTrend';
import SpotRanking from '../components/SpotRanking';
import SpotAnalyze from '../components/SpotAnalyze';
import CryptoNews from '../components/CryptoNews';
import { SiTether } from "react-icons/si";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState('futures'); // Estado para o componente ativo
  const [showDonationModal, setShowDonationModal] = useState(false); // Estado para o modal de doação

  // Temporizadores para exibir o modal
  useEffect(() => {
    const firstTimer = setTimeout(() => setShowDonationModal(true), 30000); // 45 segundos
    const recurringTimer = setInterval(() => setShowDonationModal(true), 180000); // 3 minutos

    return () => {
      clearTimeout(firstTimer);
      clearInterval(recurringTimer);
    };
  }, []);

  const handleCloseModal = () => setShowDonationModal(false);

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
      <div className="d-flex justify-content-center gap-3 my-5">
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
      </div>

      {/* Renderização com transição */}
      <TransitionGroup className="pb-2">
        <CSSTransition
          key={activeComponent}
          classNames="fade"
          timeout={300}
        >
          {renderComponent()}
        </CSSTransition>
      </TransitionGroup>

      {/* Modal de Doação */}
      <div className={`modal fade modal-lg ${showDonationModal ? 'show d-block' : ''}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title">Support Trend Crypto</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body text-center">
              <p>
                This site was an independent development. Help us keep Trend Crypto free and ad-free. Your donations support development, new features, and hosting costs.
              </p>
              <div className="bg-info rounded text-dark p-3 align-items-center justify-content-center text-center fw-bold">
                <p className="pt-3 mb-2">
                Donate <SiTether /> USDT - BSC
                  BNB Smart Chain (BEP20) to:
                  <br />
                  <strong>0x3b4ee1071c93fb1af20e883cb6dc46867e1dd20d</strong>
                </p>
                {/* Botão para copiar */}
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => navigator.clipboard.writeText("0x3b4ee1071c93fb1af20e883cb6dc46867e1dd20d")}
                >
                  Copy Address
                </button>
              </div>
              
            </div>
            <div className="modal-footer">
              <a target="_blank" href="https://buy.stripe.com/eVa9BUdCL7uG6NqfZ0"><button className="btn btn-info">Donate with Stripe</button></a>
              
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white mt-4 p-4 rounded">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <button
                    className="btn btn-link text-white"
                    onClick={() => setActiveComponent('futures')}
                  >
                    USD-M Futures
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-link text-white"
                    onClick={() => setActiveComponent('spot')}
                  >
                    Spot Market
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-link text-white"
                    onClick={() => setActiveComponent('news')}
                  >
                    Crypto News
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-3">
              <h5>About Trend Crypto</h5>
              <p>
                Trend Crypto provides real-time cryptocurrency trends, news, and insights to help traders make informed decisions.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h5>Contact & Socials</h5>
              <p>Email: support@trendcrypto.com</p>
              <p>Follow us on:</p>
              <div className="d-flex gap-2">
                <a href="#" className="btn btn-outline-light btn-sm">Twitter</a>
                <a href="#" className="btn btn-outline-light btn-sm">LinkedIn</a>
                <a href="#" className="btn btn-outline-light btn-sm">GitHub</a>
              </div>
            </div>
          </div>
          <hr className="bg-light" />
          <p className="text-center mb-0">&copy; 2024 Trend Crypto | All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
