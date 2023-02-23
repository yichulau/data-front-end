import moment from "moment";

export const optionsCalculation = {
    buyCallOption,
    sellCallOption,
    buyPutOption,
    sellPutOption,
    buyCallTimeDecayOption,
    sellCallTimeDecayOption,
    buyPutTimeDecayOption,
    sellPutTimeDecayOption
}


function buyCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string) {

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;
    const profit = expiryPrice > strikePrice ? (diffStrikeExpiration  * amountBought)- (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)

    return profit;

    
  }



  function sellCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string){

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice > strikePrice ? (optionPriced * amountBought * currentPrice) - (diffStrikeExpiration  * amountBought) : ( optionPriced * amountBought  * currentPrice)


    return profit;
  }
  

  function buyPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string){


    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? -(diffStrikeExpiration  * amountBought) - (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)


    return profit;
  }


	
  function sellPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string){

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? (diffStrikeExpiration  * amountBought) + (optionPriced * amountBought * currentPrice) : ( optionPriced * amountBought  * currentPrice)



    return profit;
  }

  // time Decay calculation
  function buyCallTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, thetaVal : number, type: string, expiry: string, markIv: any, underlyingPrice: number) {
    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const S = underlyingPrice;
    const X = strikePrice;
    const T = moment(expiry).diff(moment(), 'days') / 365;
    const r = 0; // Risk-free interest rate (assumed to be 0)
    const sigma = markIv / 100;
    const premium = optionPriced;
    const theta = thetaVal / 365;
  
    const theoreticalValue = calculateCallOptionValue(S, X, T, r, sigma, theta);

    const profitOrLoss = calculateCallOptionProfit(S, X, premium, stockPricePercent);

    const totalProfit = calculateCallOptionTotalProfit(profitOrLoss, amount);

    return totalProfit;
  
  }

  function sellCallTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, thetaVal : number, type: string, expiry: string, markIv: any, underlyingPrice: number) {
    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const S = underlyingPrice;
    const X = strikePrice;
    const T = moment(expiry).diff(moment(), 'days') / 365;
    const r = 0; // Risk-free interest rate (assumed to be 0)
    const sigma = markIv / 100;
    const premium = optionPriced;
    const theta = thetaVal / 365;

    // Calculate the theoretical value of the option
    const theoreticalValue = calculateShortCallOptionValue(S, X, T, r, sigma, theta);

    // Calculate the profit or loss of the option at expiration
    const profitOrLoss = calculateShortCallOptionProfit(S, X, premium, stockPricePercent);

    // Calculate the total profit or loss
    const totalProfit = calculateCallOptionTotalProfit(profitOrLoss, amount);

    // Return the result
    return totalProfit;
  
  }

  function buyPutTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, thetaVal : number, type: string, expiry: string, markIv: any, underlyingPrice: number) {
    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const S = underlyingPrice;
    const X = strikePrice;
    const T = moment(expiry).diff(moment(), 'days') / 365;
    const r = 0; // Risk-free interest rate (assumed to be 0)
    const sigma = markIv / 100;
    const premium = optionPriced;
    const theta = thetaVal / 365;
  
    // Calculate the theoretical value of the option
    const theoreticalValue = calculatePutOptionValue(S, X, T, r, sigma, theta);
  
    // Calculate the profit or loss of the option at expiration
    const profitOrLoss = calculateShortPutOptionProfit(S, X, premium, stockPricePercent);
  
    // Calculate the total profit or loss
    const totalProfit = calculatePutOptionTotalProfit(profitOrLoss, amount);
  
    // Return the result
    return totalProfit;
  }

  function sellPutTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number,  strikePrice : number, optionPrice : number , exchange: string, thetaVal : number, type: string, expiry: string, markIv: any, underlyingPrice: number) {
    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const S = underlyingPrice;
    const X = strikePrice;
    const T = moment(expiry).diff(moment(), 'days') / 365;
    const r = 0; // Risk-free interest rate (assumed to be 0)
    const sigma = markIv / 100;
    const premium = optionPriced;
    const theta = thetaVal / 365;
    
    // Calculate the theoretical value of the option
    const theoreticalValue = calculatePutOptionValue(S, X, T, r, sigma, theta);
  
    // Calculate the profit or loss of the option at expiration
    const profitOrLoss = calculatePutOptionProfit(S, X, premium, stockPricePercent);
  
    // Calculate the total profit or loss
    const totalProfit = calculatePutOptionTotalProfit(profitOrLoss, amount);
  
    // Return the result
    return totalProfit;
  }
  



  // black 76 model calculation

  
  function calculateCallOptionValue(S: number, X: number, T: number, r: number, sigma: number, theta: number) {
    const d1 = (Math.log(S / X) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const N_d1 = normcdf(d1);
    const N_d2 = normcdf(d2);
    const value = S * N_d1 - X * Math.exp(-r * T) * N_d2 - theta * S * N_d1 * Math.sqrt(T);
    return value;
  }

  function calculateShortCallOptionValue(S: number, X: number, T: number, r: number, sigma: number, theta: number) {
    const d1 = (Math.log(S / X) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const N_d1 = normcdf(d1);
    const N_d2 = normcdf(d2);
    const value = X * Math.exp(-r * T) * N_d2 - S * N_d1 + theta * S * N_d1 * Math.sqrt(T);
    return value;
  }

  function calculateCallOptionProfit(S: number, X: number, premium: number, stockPricePercent: number) {
    const S_expiration = S + (S * (stockPricePercent / 100));
    const profitOrLoss = Math.max(S_expiration - X, 0) - premium;
    return profitOrLoss;
  }

  function calculateShortCallOptionProfit(S: number, X: number, premium: number, stockPricePercent: number) {
    const S_expiration = S + (S * (stockPricePercent / 100));
    const profitOrLoss = premium - Math.max(S_expiration - X, 0);
    return profitOrLoss;
  }


  function calculateCallOptionTotalProfit(profitOrLoss: number, amount: number) {
    const amountBought = Number(amount);
    const totalProfit = profitOrLoss * amountBought;
    return totalProfit;
  }

  // Calculates the theoretical value of a put option using the Black-Scholes model with time decay
  function calculatePutOptionValue(S: number, X: number, T: number, r: number, sigma: number, theta: number) {
    const d1 = (Math.log(S / X) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const N_d1 = normcdf(-d1);
    const N_d2 = normcdf(-d2);
    const value = X * Math.exp(-r * T) * N_d2 - S * N_d1 + theta * S * N_d1 * Math.sqrt(T);
    return value;
  }

  // Calculates the profit or loss of a put option at expiration
  function calculatePutOptionProfit(S: number, X: number, premium: number, stockPricePercent: number) {
    const S_expiration = S - (S * (stockPricePercent / 100));
    const profitOrLoss = Math.max(X - S_expiration, 0) - premium;
    return profitOrLoss;
  }

  function calculateShortPutOptionProfit(S: number, X: number, premium: number, stockPricePercent: number) {
    const S_expiration = S - (S * (stockPricePercent / 100));
    const profitOrLoss = premium - Math.max(X - S_expiration, 0);
    return profitOrLoss;
  }

  // Calculates the total profit or loss of a put option
  function calculatePutOptionTotalProfit(profitOrLoss: number, amount: number) {
    const amountBought = Number(amount);
    const totalProfit = profitOrLoss * amountBought;
    return totalProfit;
  }

  function normcdf(x: number) {
    const a1 = 0.31938153,
      a2 = -0.356563782,
      a3 = 1.781477937,
      a4 = -1.821255978,
      a5 = 1.330274429;
    const k = 1 / (1 + 0.2316419 * Math.abs(x));
    const n = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    const m = 1 - (a1 * k + a2 * k * k + a3 * k * k * k + a4 * k * k * k * k + a5 * k * k * k * k * k) * n;
    if (x < 0) {
      return 1 - m;
    } else {
      return m;
    }
  }

