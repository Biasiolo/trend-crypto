// Analyze.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { fetchFuturesCoins } from '../utils/futuresCoins';
import { IoAnalytics } from "react-icons/io5";

const Analyze = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [trendData, setTrendData] = useState(null);
  const [dailyChange, setDailyChange] = useState(null); // Armazena o percentual do dia
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

      // Busca dados dos últimos 60 minutos
      const minuteResponse = await axios.get(
        `https://fapi.binance.com/fapi/v1/klines`,
        {
          params: {
            symbol: coinSymbol,
            interval: '1m',
            limit: 60,
          },
        }
      );

      const minuteData = minuteResponse.data;

      // Calcula maior e menor preço nos últimos 60 minutos
      const highPrices = minuteData.map((candle) => parseFloat(candle[2]));
      const lowPrices = minuteData.map((candle) => parseFloat(candle[3]));

      const highestPrice = Math.max(...highPrices);
      const lowestPrice = Math.min(...lowPrices);

      const highestIndex = highPrices.indexOf(highestPrice); // Índice do maior preço
      const lowestIndex = lowPrices.indexOf(lowestPrice); // Índice do menor preço

      const openPrice = parseFloat(minuteData[0][1]);
      const closePrice = parseFloat(minuteData[minuteData.length - 1][4]);
      const percentageChange = ((closePrice - openPrice) / openPrice) * 100;
      const currentPrice = closePrice.toFixed(4);

      // Lógica para definir o percentual com base na ordem de maior/menor preço
      const highLowPercentageChange =
        ((highestPrice - lowestPrice) / lowestPrice) *
        (highestIndex > lowestIndex ? 1 : -1);

      // Busca dados das últimas 24 horas
      const dailyResponse = await axios.get(
        `https://fapi.binance.com/fapi/v1/klines`,
        {
          params: {
            symbol: coinSymbol,
            interval: '1d',
            limit: 1, // Últimos 2 dias para calcular variação diária
          },
        }
      );

      const dailyData = dailyResponse.data;
      const dailyOpenPrice = parseFloat(dailyData[0][1]); // Preço de abertura do dia
      const dailyClosePrice = parseFloat(dailyData[dailyData.length - 1][4]); // Preço de fechamento atual
      const dailyPercentageChange = ((dailyClosePrice - dailyOpenPrice) / dailyOpenPrice) * 100;

      setTrendData({
        highestPrice,
        lowestPrice,
        highLowPercentageChange: highLowPercentageChange.toFixed(2), // Percentual com base na ordem
        percentageChange: percentageChange.toFixed(2),
        currentPrice,
      });
      setDailyChange(dailyPercentageChange.toFixed(2));
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
    <div className="bg-dark text-white rounded container p-5 mt-5 mb-4">
      <h2 className="text-center">
        <IoAnalytics /> Analyze Crypto Trends by Search (USD-M Futures)
      </h2>

      <div className="mb-3">
        <label htmlFor="cryptoSearch" className="form-label">
          Search and Select Cryptocurrency
        </label>
        <Select
          className="text-dark"
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
        <div className="mt-5 text-center">
          <h4>Trend Data for last 60 minutes ({selectedCoin})</h4>
          <p>Highest Price (60m): ${trendData.highestPrice.toFixed(4)}</p>
          <p>Lowest Price (60m): ${trendData.lowestPrice.toFixed(4)}</p>
                    
          <p className="fs-5 mb-5 text-info fw-bold">
            Percentage Change (60m): {trendData.percentageChange}%
          </p>
          <h4>Trend Data for last 24h ({selectedCoin})</h4>
          <p>Current Price: ${trendData.currentPrice}</p>
          <p className="fs-5 mb-1 text-info fw-bold">
            Daily Percentage Change (24h): {dailyChange}%
          </p>
        </div>
      )}

      {loading && <div className="alert alert-info mt-3">Loading...</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default Analyze;
