// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { fetchSpotCoins } from '../utils/spotCoins'; // Função para buscar moedas do mercado Spot

const SpotVolumeVariation = () => {
  const [coins, setCoins] = useState([]);
  const [topIncreasedVolume, setTopIncreasedVolume] = useState([]);
  const [topDecreasedVolume, setTopDecreasedVolume] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Função para formatar números
  const formatNumber = (number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  // Função para carregar moedas Spot
  useEffect(() => {
    const loadCoins = async () => {
      try {
        setError('');
        const coinList = await fetchSpotCoins();
        setCoins(coinList);
      } catch (err) {
        console.error('Erro ao buscar moedas Spot:', err);
        setError('Failed to fetch spot coins. Please try again.');
      }
    };

    loadCoins();
  }, []);

  // Função para calcular a variação de volume nos últimos 15 minutos
  const fetchVolumeVariation = useCallback(async () => {
    if (coins.length === 0) return; // Evita chamadas quando não há moedas

    try {
      setError('');
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const responses = await Promise.all(
        coins.map(async (coin) => {
          const response = await axios.get(
            `https://api.binance.com/api/v3/klines`,
            {
              params: {
                symbol: coin.symbol,
                interval: '1m', // Intervalo de 1 minuto
                limit: 30, // Últimos 30 minutos
              },
            }
          );

          const data = response.data;

          // Calcula volumes dos últimos 15 minutos e dos 15 minutos anteriores
          const volumesLast15 = data.slice(15).reduce(
            (acc, candle) =>
              acc + parseFloat(candle[5]) * ((parseFloat(candle[2]) + parseFloat(candle[3])) / 2),
            0
          );
          const volumesPrev15 = data.slice(0, 15).reduce(
            (acc, candle) =>
              acc + parseFloat(candle[5]) * ((parseFloat(candle[2]) + parseFloat(candle[3])) / 2),
            0
          );

          // Calcula a variação de volume
          const volumeChange =
            volumesPrev15 > 0
              ? ((volumesLast15 - volumesPrev15) / volumesPrev15) * 100
              : 0;

          return {
            symbol: coin.symbol,
            name: coin.name,
            volumeLast15M: volumesLast15,
            volumePrevious15M: volumesPrev15,
            volumeChange,
          };
        })
      );

      // Ordena pelos maiores aumentos e quedas no volume
      const sortedVolumes = responses.sort((a, b) => b.volumeChange - a.volumeChange);
      setTopIncreasedVolume(sortedVolumes.slice(0, 5)); // Top 10 maiores aumentos
      setTopDecreasedVolume(sortedVolumes.slice(-5).reverse()); // Top 10 maiores quedas
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Erro ao calcular variação de volume:', err);
      setError('Failed to fetch volume variation. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [coins]);

  // Atualiza os rankings apenas quando as moedas estiverem carregadas
  useEffect(() => {
    fetchVolumeVariation();
  }, [fetchVolumeVariation]);

  return (
    <div className="container bg-light my-5 py-3 border rounded">
      <h2 className="text-center mt-3 fw-bold">Spot Volume $ Variation (Last 15 Minutes)</h2>
      <hr />
      <button
        className="btn btn-info my-3"
        onClick={fetchVolumeVariation}
        disabled={loading}
      >
        Refresh Data
      </button>
      {lastUpdated && <p className="text-muted">Last updated: {lastUpdated}</p>}

      {loading && <div className="alert alert-info mt-3">Loading...</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="row mb-3">
        <div className="mt-4 col-md-6">
          <h4>Top 5 Volume Increases</h4>
          <ul className="list-group">
            {topIncreasedVolume.map((coin, index) => (
              <li
                key={coin.symbol}
                className="list-group-item d-flex justify-content-between align-items-center fw-bold"
              >
                {index + 1}. {coin.name} | Change: {formatNumber(coin.volumeChange)}%
                <span className="badge bg-success rounded-pill">
                  Last 15m: ${formatNumber(coin.volumeLast15M)} / Prev: ${formatNumber(coin.volumePrevious15M)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 col-md-6">
          <h4>Top 5 Volume Decreases</h4>
          <ul className="list-group">
            {topDecreasedVolume.map((coin, index) => (
              <li
                key={coin.symbol}
                className="list-group-item d-flex justify-content-between align-items-center fw-bold"
              >
                {index + 1}. {coin.name} | Change: {formatNumber(coin.volumeChange)}%
                <span className="badge bg-danger rounded-pill">
                  Last 15m: ${formatNumber(coin.volumeLast15M)} / Prev: ${formatNumber(coin.volumePrevious15M)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpotVolumeVariation;
