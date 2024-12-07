// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { fetchSpotCoins } from '../utils/spotCoins';
import { IoAnalytics } from "react-icons/io5";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const SpotAnalyze = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(''); // Mantido para uso no título e mensagens
  const [trendData, setTrendData] = useState(null);
  const [dailyChange, setDailyChange] = useState(null);
  const [weeklyChange, setWeeklyChange] = useState(null);
  const [weeklyVolume, setWeeklyVolume] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinList = await fetchSpotCoins();
        setCoins(coinList);
      } catch (err) {
        console.error('Erro ao buscar moedas de Spot:', err);
        setError('Failed to fetch spot coin list. Please try again.');
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

      const minuteResponse = await axios.get(
        `https://api.binance.com/api/v3/klines`,
        {
          params: {
            symbol: coinSymbol,
            interval: '1m',
            limit: 60,
          },
        }
      );

      const minuteData = minuteResponse.data;

      const highPrices = minuteData.map((candle) => parseFloat(candle[2]));
      const lowPrices = minuteData.map((candle) => parseFloat(candle[3]));

      const highestPrice = Math.max(...highPrices);
      const lowestPrice = Math.min(...lowPrices);

      const highestIndex = highPrices.indexOf(highestPrice);
      const lowestIndex = lowPrices.indexOf(lowestPrice);

      const openPrice = parseFloat(minuteData[0][1]);
      const closePrice = parseFloat(minuteData[minuteData.length - 1][4]);
      const percentageChange = ((closePrice - openPrice) / openPrice) * 100;
      const currentPrice = closePrice.toFixed(4);

      // Lógica para definir o percentual com base na ordem de maior/menor preço
      const highLowPercentageChange =
        ((highestPrice - lowestPrice) / lowestPrice) *
        (highestIndex > lowestIndex ? 1 : -1);

      // Cálculo de variação percentual entre o preço inicial (60 minutos antes) e o preço atual
      const startPrice = parseFloat(minuteData[0][1]);
      const priceChangePercent = ((closePrice - startPrice) / startPrice) * 100;

      const dailyResponse = await axios.get(
        `https://api.binance.com/api/v3/klines`,
        {
          params: {
            symbol: coinSymbol,
            interval: '1d',
            limit: 1,
          },
        }
      );

      const dailyData = dailyResponse.data;
      const dailyOpenPrice = parseFloat(dailyData[0][1]);
      const dailyClosePrice = parseFloat(dailyData[0][4]);
      const dailyPercentageChange = ((dailyClosePrice - dailyOpenPrice) / dailyOpenPrice) * 100;

      const weeklyResponse = await axios.get(
        `https://api.binance.com/api/v3/klines`,
        {
          params: {
            symbol: coinSymbol,
            interval: '1d',
            limit: 7,
          },
        }
      );

      const weeklyData = weeklyResponse.data;
      const weeklyOpenPrice = parseFloat(weeklyData[0][1]);
      const weeklyClosePrice = parseFloat(weeklyData[weeklyData.length - 1][4]);
      const weeklyPercentageChange = ((weeklyClosePrice - weeklyOpenPrice) / weeklyOpenPrice) * 100;

      const weeklyVolumeUSD = weeklyData.reduce((acc, day) => {
        const dailyVolume = parseFloat(day[5]);
        const averagePrice = (parseFloat(day[2]) + parseFloat(day[3])) / 2;
        return acc + dailyVolume * averagePrice;
      }, 0);

      setTrendData({
        highestPrice,
        lowestPrice,
        highLowPercentageChange: highLowPercentageChange.toFixed(2),
        percentageChange: percentageChange.toFixed(2),
        priceChangePercent: priceChangePercent.toFixed(2),
        currentPrice,
      });
      setDailyChange(dailyPercentageChange.toFixed(2));
      setWeeklyChange(weeklyPercentageChange.toFixed(2));
      setWeeklyVolume(weeklyVolumeUSD.toFixed(2));
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
    <div className="bg-dark text-white rounded container p-5 my-5">
      <h2 className="text-center mb-4 display-6 fw-bold">
        <IoAnalytics className="me-2" /> Analyze Trends Spot ({selectedCoin || "Select a coin"})
      </h2>

      <div className="mb-4">
        <label htmlFor="cryptoSearch" className="form-label">
          Search and Select Cryptocurrency
        </label>
        <Select
          className="text-dark"
          id="cryptoSearch"
          options={coinOptions}
          onChange={(selectedOption) => {
            setSelectedCoin(selectedOption.label); // Atualiza com o nome da moeda para exibição
            fetchTrendData(selectedOption.value);
          }}
          isSearchable={true}
          placeholder="Search for a cryptocurrency..."
        />
      </div>

      {trendData && (
        <div className="mt-5 text-center">
          <div className="card bg-secondary text-white shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title text-info fw-bold">Last 60 Minutes Trend</h4>
              <p>Highest Price: <span className="fw-bold">${trendData.highestPrice.toFixed(4)}</span></p>
              <p>Lowest Price: <span className="fw-bold">${trendData.lowestPrice.toFixed(4)}</span></p>
              <p>Current Price: <span className="fw-bold">${trendData.currentPrice}</span></p>
              <p className="text-info fs-5 fw-bold">
                Price Change (60m):{' '}
                <span className={`fw-bold bg-light rounded p-2 ${trendData.priceChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {trendData.priceChangePercent}%
                  {trendData.priceChangePercent >= 0 ? <FaArrowUp className="ms-2" /> : <FaArrowDown className="ms-2" />}
                </span>
              </p>
            </div>
          </div>

          {/* Retém as análises diárias e semanais */}
          <div className="card bg-secondary text-white shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title text-info fw-bold">24-Hour Trend</h4>
              <p>Current Price: <span className="fw-bold">${trendData.currentPrice}</span></p>
              <p>Daily Change: <span className="fw-bold text-info">{dailyChange}%</span></p>
            </div>
          </div>

          <div className="card bg-secondary text-white shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-info fw-bold">Weekly Trend</h4>
              <p>Weekly Change Price: <span className="fw-bold text-info">{weeklyChange}%</span></p>
              <p>Weekly Volume (USD): <span className="fw-bold">${weeklyVolume}</span></p>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="alert alert-info mt-3">Loading...</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default SpotAnalyze;
