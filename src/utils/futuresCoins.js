import axios from 'axios';

export const fetchFuturesCoins = async () => {
  try {
    // Faz uma solicitação para obter todas as informações de negociação de futuros
    const response = await axios.get('https://fapi.binance.com/fapi/v1/exchangeInfo');

    // Filtra contratos perpétuos em USDT e que estão ativas (status TRADING)
    const symbols = response.data.symbols
      .filter(
        (symbol) =>
          symbol.contractType === 'PERPETUAL' && // Contrato perpétuo
          symbol.status === 'TRADING' && // Ativo para negociação
          symbol.quoteAsset === 'USDT' // Mercado USDT
      )
      .map((symbol) => ({
        symbol: symbol.symbol, // Exemplo: BTCUSDT
        name: `${symbol.baseAsset} / ${symbol.quoteAsset}`, // Exemplo: Bitcoin / Tether
      }));

    return symbols; // Retorna a lista formatada
  } catch (err) {
    console.error('Erro ao buscar os pares de moedas de futuros:', err);
    return []; // Retorna uma lista vazia em caso de erro
  }
};
