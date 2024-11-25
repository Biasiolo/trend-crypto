import axios from 'axios';

export const fetchSpotCoins = async () => {
  try {
    // Faz uma solicitação para obter todas as informações de negociação de mercado Spot
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');

    // Filtra pares que terminam com USDT e estão ativas (status TRADING)
    const symbols = response.data.symbols
      .filter(
        (symbol) =>
          symbol.status === 'TRADING' && // Apenas ativos em negociação
          symbol.quoteAsset === 'USDT' // Apenas pares no mercado USDT
      )
      .map((symbol) => ({
        symbol: symbol.symbol, // Exemplo: BTCUSDT
        name: `${symbol.baseAsset} / ${symbol.quoteAsset}`, // Exemplo: Bitcoin / Tether
      }));

    return symbols; // Retorna a lista formatada
  } catch (err) {
    console.error('Erro ao buscar os pares de moedas do mercado Spot:', err);
    return []; // Retorna uma lista vazia em caso de erro
  }
};
