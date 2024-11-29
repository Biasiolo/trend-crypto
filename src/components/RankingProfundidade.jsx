// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchSpotCoins } from '../utils/spotCoins'; // Função para buscar moedas do mercado Spot

const RankingProfundidade = () => {
  const [coins, setCoins] = useState([]);
  const [topTightSpreads, setTopTightSpreads] = useState([]);
  const [topWideSpreads, setTopWideSpreads] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Função para carregar moedas
  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinList = await fetchSpotCoins(); // Busca moedas Spot
        setCoins(coinList);
      } catch (err) {
        console.error('Erro ao buscar moedas:', err);
        setError('Failed to fetch spot coins. Please try again.');
      }
    };

    loadCoins();
  }, []);

  // Função para calcular profundidade do mercado
  const fetchMarketDepth = useCallback(async () => {
    try {
      setError('');
      setLoading(true);

      const responses = await Promise.all(
        coins.map(async (coin) => {
          const response = await axios.get(
            `https://api.binance.com/api/v3/depth`,
            {
              params: {
                symbol: coin.symbol,
                limit: 5, // Top 5 bids e asks
              },
            }
          );

          const data = response.data;

          // Extrai os preços do maior bid e menor ask
          const highestBid = parseFloat(data.bids[0][0]); // Maior preço de compra
          const lowestAsk = parseFloat(data.asks[0][0]); // Menor preço de venda
          const spread = ((lowestAsk - highestBid) / highestBid) * 100; // Spread percentual

          return {
            symbol: coin.symbol,
            name: coin.name,
            highestBid: highestBid.toFixed(4),
            lowestAsk: lowestAsk.toFixed(4),
            spread: spread.toFixed(2),
          };
        })
      );

      // Ordena pelo menor e maior spread
      const sortedSpreads = responses.sort((a, b) => a.spread - b.spread);
      setTopTightSpreads(sortedSpreads.slice(0, 10)); // Menores spreads
      setTopWideSpreads(sortedSpreads.slice(-10).reverse()); // Maiores spreads
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Erro ao calcular profundidade de mercado:', err);
      setError('Failed to fetch market depth. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [coins]);

  // Atualiza os rankings ao carregar o componente
  useEffect(() => {
    if (coins.length > 0) {
      fetchMarketDepth();
    }
  }, [coins, fetchMarketDepth]);

  return (
    <div className="container bg-light mt-5 py-3 border rounded">
      <h2 className="text-center mt-3">Market Depth Ranking (+10/-10 Spread)</h2>
      <hr />
      <button
        className="btn btn-info my-3"
        onClick={fetchMarketDepth}
        disabled={loading}
      >
        Refresh Ranking
      </button>
      {lastUpdated && <p className="text-muted">Last updated: {lastUpdated}</p>}

      {loading && <div className="alert alert-info mt-3">Loading...</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="row mb-3">
        <div className="mt-4 col-md-6">
          <h4>Top 10 Tightest Spreads</h4>
          <ul className="list-group">
            {topTightSpreads.map((trend, index) => (
              <li
                key={trend.symbol}
                className="list-group-item d-flex justify-content-between align-items-center fw-bold"
              >
                {index + 1}. {trend.name} | Spread: {trend.spread}%
                <span className="badge bg-success rounded-pill">
                  Bid: ${trend.highestBid} / Ask: ${trend.lowestAsk}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 col-md-6">
          <h4>Top 10 Widest Spreads</h4>
          <ul className="list-group">
            {topWideSpreads.map((trend, index) => (
              <li
                key={trend.symbol}
                className="list-group-item d-flex justify-content-between align-items-center fw-bold"
              >
                {index + 1}. {trend.name} | Spread: {trend.spread}%
                <span className="badge bg-danger rounded-pill">
                  Bid: ${trend.highestBid} / Ask: ${trend.lowestAsk}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RankingProfundidade;
