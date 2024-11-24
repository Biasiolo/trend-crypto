// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Importa React-Select
import { fetchCoins } from '../utils/coins';

const CryptoTrend = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [trendData, setTrendData] = useState(null);
  const [topGainers, setTopGainers] = useState([]); // Maiores subidas
  const [topLosers, setTopLosers] = useState([]); // Maiores quedas
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false); // Controle do botão de refresh

  // Fetch todas as moedas disponíveis na Binance
  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinList = await fetchCoins();
        setCoins(coinList);
      } catch (err) {
        console.error('Erro ao buscar moedas:', err);
        setError('Failed to fetch coin list. Please try again.');
      }
    };

    loadCoins();
  }, []);

  // Fetch dados da moeda selecionada
  const fetchTrendData = async (coinSymbol) => {
    const symbol = coinSymbol || selectedCoin; // Usa o parâmetro ou o estado selecionado

    if (!symbol) {
      setError('Please select a cryptocurrency.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await axios.get(
        `https://api.binance.com/api/v3/klines`,
        {
          params: {
            symbol,
            interval: '1m',
            limit: 10,
          },
        }
      );

      const data = response.data;
      const openPrice = parseFloat(data[0][1]);
      const closePrice = parseFloat(data[9][4]);
      const percentageChange = ((closePrice - openPrice) / openPrice) * 100;

      setTrendData({
        openPrice,
        closePrice,
        percentageChange: percentageChange.toFixed(3),
      });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Memoize fetchTopTrends to avoid ESLint warning
  const fetchTopTrends = useCallback(async () => {
    try {
      setError('');
      setLoading(true);

      const responses = await Promise.all(
        coins.map(async (coin) => {
          const response = await axios.get(
            `https://api.binance.com/api/v3/klines`,
            {
              params: {
                symbol: coin.symbol,
                interval: '1m',
                limit: 10,
              },
            }
          );

          const data = response.data;
          const openPrice = parseFloat(data[0][1]);
          const closePrice = parseFloat(data[9][4]);
          const percentageChange = ((closePrice - openPrice) / openPrice) * 100;

          return {
            symbol: coin.symbol,
            name: coin.name,
            percentageChange: percentageChange.toFixed(2),
          };
        })
      );

      // Ordena pelas maiores subidas e quedas
      const sortedTrends = responses.sort(
        (a, b) => b.percentageChange - a.percentageChange
      );
      setTopGainers(sortedTrends.slice(0, 10)); // Top 10 Gainers
      setTopLosers(sortedTrends.slice(-10).reverse()); // Top 10 Losers (invertendo para ordem crescente)
    } catch (err) {
      console.error('Erro ao buscar tendências:', err);
      setError('Failed to fetch top trends. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [coins]);

  // Fetch Top Gainers e Losers ao carregar o componente
  useEffect(() => {
    if (coins.length > 0) {
      fetchTopTrends();
    }
  }, [coins, fetchTopTrends]);

  // Função para atualizar o ranking e desativar o botão por 1 minuto
  const handleRefreshClick = () => {
    fetchTopTrends();
    setIsRefreshDisabled(true);
    setTimeout(() => setIsRefreshDisabled(false), 60000); // Desativa o botão por 1 minuto
  };

  // Formatar moedas para uso no React-Select
  const coinOptions = coins.map((coin) => ({
    value: coin.symbol,
    label: coin.name,
  }));

  return (
    <div className="container mt-4">
      <h2>Analyze Crypto Trends</h2>

      <div className="mb-3">
        <label htmlFor="cryptoSearch" className="form-label">
          Search and Select Cryptocurrency
        </label>
        <Select
          id="cryptoSearch"
          options={coinOptions}
          onChange={(selectedOption) => {
            setSelectedCoin(selectedOption.value);
            fetchTrendData(selectedOption.value); // Inicia o fetch ao selecionar
          }}
          isSearchable={true} // Habilita busca
          placeholder="Search for a cryptocurrency..."
        />
      </div>

      {loading && <div className="alert alert-info mt-3">Loading...</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {trendData && (
        <div className="mt-4">
          <h4>Trend Data for last 10 minutes ({selectedCoin})</h4>
          <p>Opening Price: ${trendData.openPrice.toFixed(4)}</p>
          <p>Closing Price: ${trendData.closePrice.toFixed(4)}</p>
          <p>Percentage Change (10m): {trendData.percentageChange}%</p>
        </div>
      )}

      <div className="mt-5">
        <h3>Top 10 Gainers and Losers by 10-Minute Percentage Change</h3>
        <button
          className="btn btn-secondary mb-3"
          onClick={handleRefreshClick}
          disabled={isRefreshDisabled}
        >
          Refresh Ranking
        </button>

        {topGainers.length === 0 && topLosers.length === 0 && !loading && (
          <p>No trends available. Please try again later.</p>
        )}

        <div className="row mb-5">
          <div className="mt-4 col-md-6">
            <h4>Top 10 Gainers</h4>
            <ul className="list-group">
              {topGainers.map((trend, index) => (
                <li
                  key={trend.symbol}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {index + 1}. {trend.name}
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
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {index + 1}. {trend.name}
                  <span className="badge bg-danger rounded-pill">
                    {trend.percentageChange}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTrend;
