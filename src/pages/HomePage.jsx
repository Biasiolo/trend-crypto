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
import SpotFive from '../components/SpotFive';
import FutureFive from '../components/FutureFive';
import CryptoNews from '../components/CryptoNews';
import { SiTether } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { SiBinance } from "react-icons/si";
import { SiSolana } from "react-icons/si";
import { SiDogecoin } from "react-icons/si";
import { LuNewspaper } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { PiCoinVertical } from "react-icons/pi";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState('futures'); // Estado para o componente ativo
  const [showDonationModal, setShowDonationModal] = useState(false); // Estado para o modal de doação

  // Temporizadores para exibir o modal
  useEffect(() => {
    const firstTimer = setTimeout(() => setShowDonationModal(true), 30000); // 30 segundos
    const recurringTimer = setInterval(() => setShowDonationModal(true), 900000); // 

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
            <FutureFive />
            <CryptoTrend />
            
          </div>
        );
      case 'spot':
        return (
          <div key="spot">
            <SpotRanking />
            <SpotAnalyze />
            <SpotFive />
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
    <div className="container mt-0">
      {/* Header com Link para Home */}
      <div
        className="header bg-dark text-white text-center p-5 mt-0"
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

      {/* Descrição do site */}
      <div className="bg-secondary-subtle text-dark text-center mt- p-4 rounded-bottom">
        <h2 className="text-info-emphasis">Quick Analysis and Decisions!</h2>
        <p className="bannertext px-3">
          Trend Crypto is your essential tool for fast decision-making in cryptocurrency trading. Powered by real-time data from Binance, we help you track market movements, analyze gains and losses, and stay updated with the latest crypto trends. Our tools include top trends from the last 30 minutes, general rankings based on the current daily close, and detailed individual analyses to give you the edge in a fast-moving market.
        </p>
        <hr></hr>
        {/* Vantagens do site */}
        <div className="mt-4">
          <div className="row text-center alig-items-center rounded">
            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <h5 className="text-info-emphasis"><LuNewspaper /> Latest News</h5>
                <p className="text-dark mb-0">Stay updated with the latest cryptocurrency news</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <h5 className="text-info-emphasis"><TbBrandGoogleAnalytics /> Spot & Futures</h5>
                <p className="text-dark mb-0">Analyze the Spot and Futures markets effortlessly</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <h5 className="text-info-emphasis"><FaMoneyBillTrendUp /> Top Trends</h5>
                <p className="text-dark mb-0">Track the biggest movers in the last 5 min, 30 min and current day</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="p-3">
                <h5 className="text-info-emphasis"><PiCoinVertical /> Individual Analysis</h5>
                <p className="text-dark mb-0">Get detailed performance insights for each currency</p>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* Botões de navegação */}
      <div className="d-flex justify-content-center gap-3 mt-5">
        <button
          className={`btn btn-outline-dark flex-grow-1  ${activeComponent === 'futures' ? 'active' : ''}`}
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
          Cryptos News
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
              <h5 className="modal-title text-info">Support Trend Crypto</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body text-center">
              <p>
                This website was an independent development. Help us keep Trend Crypto free and ad-free. Your donations support development, new features, and hosting costs.
              </p>
              <div className="bg-secondary-subtle rounded text-dark p-2 align-items-center justify-content-center text-center fw-bold">


                <h3 className="fs-4 p-2">Donate</h3>
                <p className="my-2"><SiTether /> USDT | <FaEthereum /> ETH | <SiBinance /> BNB | <SiSolana /> SOL | <SiDogecoin /> DOGE </p>
                <p className="m-0">Network: BSC BNB Smart Chain (BEP20)</p>

                <br />
                <p className=" key text-dark ">
                  0x3b4ee1071c93fb1af20e883cb6dc46867e1dd20d
                </p>
                {/* Botão para copiar */}
                <button
                  className="bg-info btn btn-outline-dark btn-sm mb-3"
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

      <div className="text-center mb-5">
      <a
        href="https://www.producthunt.com/posts/trend-crypto?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-trend&#0045;crypto"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=652332&theme=dark"
          alt="Trend Crypto - Real-time cryptocurrency analysis | Product Hunt"
          style={{ width: "250px", height: "54px" }}
        />
      </a>
    </div>


      {/* Footer */}
<footer className="bg-dark text-white mt-4 p-4 rounded-top">
  <div className="container">
    <div className="row">
      {/* About Trend Crypto */}
      <div className="col-md-3 mb-3 text-center">
        <h5 className='text-info'>About Trend Crypto</h5>
        <p>
          Trend Crypto provides real-time cryptocurrency trends, news, and insights to help traders make informed decisions.
        </p>
      </div>


      {/* Quick Links */}
      <div className="col-md-3 mb-3 text-center">
        <h5 className='text-info'>Quick Links</h5>
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

      

      {/* Contact */}
      <div className="col-md-3 mb-3 text-center">
        <h5 className='text-info'>Contact</h5>
        <p>Email: <a href="mailto:support@trendcrypto.com" className="text-white">support@trendcrypto.com</a></p>
        <p>Follow us on:</p>
        <div className="d-flex gap-2 justify-content-center text-center">
          <a href="#" className="btn btn-outline-light btn-sm">Twitter</a>
          <a href="#" className="btn btn-outline-light btn-sm">LinkedIn</a>
          <a href="#" className="btn btn-outline-light btn-sm">GitHub</a>
        </div>
      </div>

      {/* Support */}
      <div className="col-md-3 mb-3 text-center">
        <h5 className='text-info'>Support</h5>
        <p>Your support keeps Trend Crypto free and ad-free.</p>
        <button
          className="btn btn-outline-info w-100"
          onClick={() => setShowDonationModal(true)} // Abre o modal
        >
          Donate
        </button>
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
