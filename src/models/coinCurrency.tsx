export const coinCurrencyModel = {
    getDataByCurrency
  
  }
  
  function getDataByCurrency(coinId: number) {
      switch (coinId) {
        case 1:
          return "BTC";
        case 2:
          return "ETH";
        case 3:
          return "SOL";
        default:
          return "Unknown";
      }
  }