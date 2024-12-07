// SpotTrend.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchSpotCoins } from '../utils/spotCoins'; // Função para moedas do mercado Spot

const SpotTrend = () => {
  const [coins, setCoins] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Função para carregar a lista de moedas do mercado Spot
  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinList = await fetchSpotCoins(); // Usa a função para buscar moedas do mercado Spot
        setCoins(coinList);
      } catch (err) {
        console.error('Erro ao buscar moedas de Spot:', err);
        setError('Failed to fetch spot coin list. Please try again.');
      }
    };

    loadCoins();
  }, []);

  // Função para buscar as tendências das últimas 30 minutos
  const fetchTopTrends = useCallback(async () => {
    try {
      setError('');
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responses = await Promise.all(
        coins.map(async (coin) => {
          const response = await axios.get(
            `https://api.binance.com/api/v3/klines`, // Endpoint do mercado Spot
            {
              params: {
                symbol: coin.symbol,
                interval: '1m', // Intervalo de 1 minuto
                limit: 30, // Últimos 30 minutos
              },
            }
          );

          const data = response.data;
          const openPrice = parseFloat(data[0][1]); // Preço de abertura da primeira vela
          const closePrice = parseFloat(data[data.length - 1][4]); // Preço de fechamento da última vela
          const percentageChange = ((closePrice - openPrice) / openPrice) * 100;

          return {
            symbol: coin.symbol,
            name: coin.name,
            closePrice: closePrice.toFixed(4), // Último preço
            percentageChange: percentageChange.toFixed(2), // Mudança percentual
          };
        })
      );

      // Ordena os resultados e separa os ganhadores e perdedores
      const sortedTrends = responses.sort(
        (a, b) => b.percentageChange - a.percentageChange
      );
      setTopGainers(sortedTrends.slice(0, 10)); // Top 10 ganhadores
      setTopLosers(sortedTrends.slice(-10).reverse()); // Top 10 perdedores
      setLastUpdated(new Date().toLocaleString()); // Atualiza o horário da última atualização
    } catch (err) {
      console.error('Erro ao buscar tendências:', err);
      setError('Failed to fetch top trends. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [coins]);

  // Carrega as tendências ao montar o componente
  useEffect(() => {
    if (coins.length > 0) {
      fetchTopTrends();
    }
  }, [coins, fetchTopTrends]);

  // Função para atualizar os rankings e desativar o botão por 1 minuto
  const handleRefreshClick = () => {
    fetchTopTrends();
    setIsRefreshDisabled(true);
    setTimeout(() => setIsRefreshDisabled(false), 60000); // Desativa o botão por 60 segundos
  };

  return (
    <div className="container bg-light my-5 py-3 border rounded">
      <h2 className="text-center mt-3 fw-bold">Top 10 Crypto Trends (Spot Market - Last 30 min)</h2>
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

      <div className="row mb-3">
        <div className="mt-4 col-md-6">
          <h4>Top 10 Gainers</h4>
          <ul className="list-group">
            {topGainers.map((trend, index) => (
              <li
                key={trend.symbol}
                className="list-group-item d-flex justify-content-between align-items-center fw-bold"
              >
                {index + 1}. {trend.name} | ${trend.closePrice}
                <span className="badge bg-success rounded-pill">
                  +{trend.percentageChange}%
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 col-md-6">
          <h4>Top 10 Losers</h4>
          <ul className="list-group">
            {topLosers.map((trend, index) => (
              <li
                key={trend.symbol}
                className="list-group-item d-flex justify-content-between align-items-center fw-bold"
              >
                {index + 1}. {trend.name} | ${trend.closePrice}
                <span className="badge bg-danger rounded-pill">
                  {trend.percentageChange}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpotTrend;
