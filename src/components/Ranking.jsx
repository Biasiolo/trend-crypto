// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchFuturesCoins } from '../utils/futuresCoins'; // Função para buscar moedas do mercado futuro

const Ranking = () => {
  const [coins, setCoins] = useState([]);
  const [topGainers, setTopGainers] = useState([]); // Maiores subidas
  const [topLosers, setTopLosers] = useState([]); // Maiores quedas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(''); // Estado para última atualização

  // Fetch todas as moedas disponíveis no mercado futuro perpétuo
  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinList = await fetchFuturesCoins();
        setCoins(coinList);
      } catch (err) {
        console.error('Erro ao buscar moedas de futuros:', err);
        setError('Failed to fetch futures coin list. Please try again.');
      }
    };

    loadCoins();
  }, []);

  // Função para buscar o ranking geral de ganhos e perdas
  const fetchRankingData = useCallback(async () => {
    try {
      setError('');
      setLoading(true);

      const responses = await Promise.all(
        coins.map(async (coin) => {
          const response = await axios.get(
            `https://fapi.binance.com/fapi/v1/klines`,
            {
              params: {
                symbol: coin.symbol,
                interval: '1d', // Intervalo de 1 dia
                limit: 1, // Apenas o último fechamento diário
              },
            }
          );

          const data = response.data;
          const openPrice = parseFloat(data[0][1]); // Preço de abertura do dia
          const closePrice = parseFloat(data[0][4]); // Preço de fechamento do dia
          const percentageChange = ((closePrice - openPrice) / openPrice) * 100;

          return {
            symbol: coin.symbol,
            name: coin.name,
            closePrice: closePrice.toFixed(4), // Adiciona o último preço
            percentageChange: percentageChange.toFixed(2),
          };
        })
      );

      // Ordena pelas maiores subidas e quedas
      const sortedTrends = responses.sort(
        (a, b) => b.percentageChange - a.percentageChange
      );
      setTopGainers(sortedTrends.slice(0, 5)); // Top 5 Gainers
      setTopLosers(sortedTrends.slice(-5).reverse()); // Top 5 Losers
      setLastUpdated(new Date().toLocaleString()); // Atualiza a hora da última atualização
    } catch (err) {
      console.error('Erro ao buscar ranking geral:', err);
      setError('Failed to fetch ranking data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [coins]);

  // Busca o ranking geral ao carregar o componente
  useEffect(() => {
    if (coins.length > 0) {
      fetchRankingData();
    }
  }, [coins, fetchRankingData]);

  const handleRefreshClick = () => {
    fetchRankingData();
    setIsRefreshDisabled(true);
    setTimeout(() => setIsRefreshDisabled(false), 60000); // Desativa o botão por 1 minuto
  };

  return (
    <div className="container bg-light my-5 pb-3 border rounded">
      <h2 className="text-center mt-3 fw-bold">General Market Ranking (USD-M Futures - Current daily close)</h2>
      <hr></hr>
      <button
        className="btn btn-info my-3"
        onClick={handleRefreshClick}
        disabled={isRefreshDisabled}
      >
        Refresh Ranking
      </button>
      {lastUpdated && (
        <p className="text-muted">Last updated: {lastUpdated}</p>
      )}

      {loading && <div className="alert alert-info mt-3">Loading...</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {!loading && !error && (
        <div className="row mt-1">
          <div className="col-md-6 mt-3">
            <h4>Top 5 Gainers</h4>
            <ul className="list-group">
              {topGainers.map((trend, index) => (
                <li
                  key={trend.symbol}
                  className="list-group-item d-flex justify-content-between align-items-center fw-bold"
                >
                  {index + 1}. {trend.name} - ${trend.closePrice}
                  <span className="badge bg-success rounded-pill">
                    +{trend.percentageChange}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6 mt-3">
            <h4>Top 5 Losers</h4>
            <ul className="list-group">
              {topLosers.map((trend, index) => (
                <li
                  key={trend.symbol}
                  className="list-group-item d-flex justify-content-between align-items-center fw-bold"
                >
                  {index + 1}. {trend.name} - ${trend.closePrice}
                  <span className="badge bg-danger rounded-pill">
                    {trend.percentageChange}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranking;
