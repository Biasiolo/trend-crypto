import axios from 'axios';

export const fetchCoins = async () => {
  try {
    // Faz uma solicitação para obter todas as informações de negociação
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');

    // Filtra pares que terminam com USDT e estão ativas (status TRADING)
    const symbols = response.data.symbols
      .filter((symbol) => symbol.symbol.endsWith('USDT') && symbol.status === 'TRADING') // Foco em USDT e ativas
      .map((symbol) => ({
        symbol: symbol.symbol, // Exemplo: BTCUSDT
        name: `${symbol.baseAsset} / ${symbol.quoteAsset}`, // Exemplo: Bitcoin / Tether
      }));

    return symbols; // Retorna a lista formatada
  } catch (err) {
    console.error('Erro ao buscar os pares de moedas:', err);
    return []; // Retorna uma lista vazia em caso de erro
  }
};
