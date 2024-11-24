// Analyze.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { fetchFuturesCoins } from '../utils/futuresCoins';

const Analyze = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [trendData, setTrendData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const fetchTrendData = async (coinSymbol) => {
    if (!coinSymbol) {
      setError('Please select a cryptocurrency.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await axios.get(
        `https://fapi.binance.com/fapi/v1/klines`,
        {
          params: {
            symbol: coinSymbol,
            interval: '1m', // Intervalo de 1 minuto
            limit: 60, // Últimos 60 minutos
          },
        }
      );

      const data = response.data;

      // Calcula maior e menor preço
      const highPrices = data.map((candle) => parseFloat(candle[2])); // Preço mais alto em cada vela
      const lowPrices = data.map((candle) => parseFloat(candle[3])); // Preço mais baixo em cada vela

      const highestPrice = Math.max(...highPrices); // Maior preço nos últimos 60 minutos
      const lowestPrice = Math.min(...lowPrices); // Menor preço nos últimos 60 minutos

      const openPrice = parseFloat(data[0][1]); // Preço de abertura da primeira vela
      const closePrice = parseFloat(data[data.length - 1][4]); // Preço de fechamento da última vela
      const percentageChange = ((closePrice - openPrice) / openPrice) * 100;

      setTrendData({
        highestPrice,
        lowestPrice,
        percentageChange: percentageChange.toFixed(2),
      });
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const coinOptions = coins.map((coin) => ({
    value: coin.symbol,
    label: coin.name,
  }));

  return (
    <div className="bg-dark text-white rounded container p-4 mt-5 mb-4">
      <h2 className="text-center">Analyze Crypto Trends by Search (USD-M Futures)</h2>

      <div className="mb-3">
        <label htmlFor="cryptoSearch" className="form-label">
          Search and Select Cryptocurrency
        </label>
        <Select className="text-dark"
          id="cryptoSearch"
          options={coinOptions}
          onChange={(selectedOption) => {
            setSelectedCoin(selectedOption.value);
            fetchTrendData(selectedOption.value);
          }}
          isSearchable={true}
          placeholder="Search for a cryptocurrency..."
        />
      </div>

      {trendData && (
        <div className="mt-4 text-center">
          <h4>Trend Data for last 60 minutes ({selectedCoin})</h4>
          <p>Highest Price: ${trendData.highestPrice.toFixed(4)}</p>
          <p>Lowest Price: ${trendData.lowestPrice.toFixed(4)}</p>
          <p className="fs-5 mb-4 text-danger fw-bold">
            Percentage Change (60m): {trendData.percentageChange}%
          </p>
        </div>
      )}

      {loading && <div className="alert alert-info mt-3">Loading...</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default Analyze;
