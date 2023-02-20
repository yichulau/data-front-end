export const optionsCalculation = {
    buyCallOption,
    sellCallOption,
    buyPutOption,
    sellPutOption
}


function buyCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, thetaVal : number, type: string, expiryData: string, markIv: any) {

    const optionData = {
        underlyingPrice: currentPrice,
        strike: strikePrice,
        callOrPut: type,
        expiry: expiryData, // Change this to the appropriate expiry date for your option
        markIv: markIv/100, // Change this to the implied volatility for your option
    };

    const optionPricing = calculateOptionPrice(optionData);
    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;


    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;
    const profit = expiryPrice > strikePrice ? (diffStrikeExpiration  * amountBought)- (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)

    return profit;

    
  }



  function sellCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string, thetaVal : number ){

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice > strikePrice ? (optionPriced * amountBought * currentPrice) - (diffStrikeExpiration  * amountBought) : ( optionPriced * amountBought  * currentPrice)


    return profit;
  }
  

  function buyPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string, thetaVal : number){


    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? -(diffStrikeExpiration  * amountBought) - (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)


    return profit;
  }


	
  function sellPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string, thetaVal : number){

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? (diffStrikeExpiration  * amountBought) + (optionPriced * amountBought * currentPrice) : ( optionPriced * amountBought  * currentPrice)



    return profit;
  }


  function calculateOptionPrice(optionData : any) {
    const underlyingPrice = optionData.underlyingPrice;
    const strikePrice = optionData.strike;
    const timeToExpiration = calculateTimeToExpiration(optionData.expiry);
    const riskFreeRate = 0.05; // Change this to the appropriate value for your market
    const volatility = optionData.markIv / 100; // Convert implied volatility to decimal format
    const d1 = (Math.log(underlyingPrice / strikePrice) + (riskFreeRate + (volatility * volatility) / 2) * timeToExpiration) / (volatility * Math.sqrt(timeToExpiration));
    const d2 = d1 - (volatility * Math.sqrt(timeToExpiration));
    const cumulativeDistributionD1 = cumulativeDistribution(d1);
    const cumulativeDistributionD2 = cumulativeDistribution(d2);
    const callPrice = (underlyingPrice * cumulativeDistributionD1) - (strikePrice * Math.exp(-riskFreeRate * timeToExpiration) * cumulativeDistributionD2);
    const putPrice = (strikePrice * Math.exp(-riskFreeRate * timeToExpiration) * (1 - cumulativeDistributionD2)) - (underlyingPrice * (1 - cumulativeDistributionD1));
    const optionPrice = optionData.callOrPut === 'C' ? callPrice : putPrice;
    return optionPrice;
  }
  
  function calculateTimeToExpiration(expiryDate : any) {
    const now  : any= new Date();
    const expiration  : any = new Date(expiryDate);
    const timeToExpiration = (expiration - now) / (1000 * 60 * 60 * 24 * 365.25);
    return timeToExpiration;
  }


  function cumulativeDistribution(x : number) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    if (x >= 0) {
      return 1 - d * p;
    } else {
      return d * p;
    }
  }