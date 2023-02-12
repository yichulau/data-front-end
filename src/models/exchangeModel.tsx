export const exchangeModel = {
  getDataByExchange

}

function getDataByExchange(exchangeID: number) {
    switch (exchangeID) {
      case 1:
        return "ByBit";
      case 2:
        return "Binance";
      case 3:
        return "BitCom";
      case 4:
        return "Deribit";
      case 5:
        return "OKEX";
      default:
        return "Unknown";
    }
}