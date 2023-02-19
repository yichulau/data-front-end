export const optionsCalculation = {
    buyCallOption,
    sellCallOption,
    buyPutOption,
    sellPutOption
}


function buyCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, thetaVal : number) {
    let optionPriced = 0;
    if(exchange === 'Bybit' || exchange === 'Binance'){
        optionPriced = optionPrice/currentPrice
    } else {
        optionPriced = optionPrice
    }
    
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;
    const profit = expiryPrice > strikePrice ? (diffStrikeExpiration  * amountBought)- (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)

    return profit;

    
  }



  function sellCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string, thetaVal : number ){
    let optionPriced = 0;
    if(exchange === 'Bybit'){
        optionPriced = optionPrice/currentPrice
    } else {
        optionPriced = optionPrice
    }


    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice > strikePrice ? (optionPriced * amountBought * currentPrice) - (diffStrikeExpiration  * amountBought) : ( optionPriced * amountBought  * currentPrice)


    return profit;
  }
  

  function buyPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string, thetaVal : number){
    let optionPriced = 0;
    if(exchange === 'Bybit'){
        optionPriced = optionPrice/currentPrice
    } else {
        optionPriced = optionPrice
    }


    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? -(diffStrikeExpiration  * amountBought) - (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)


    return profit;
  }


	
  function sellPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string, thetaVal : number){
    let optionPriced = 0;
    if(exchange === 'Bybit'){
        optionPriced = optionPrice/currentPrice
    } else {
        optionPriced = optionPrice
    }


    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? (diffStrikeExpiration  * amountBought) + (optionPriced * amountBought * currentPrice) : ( optionPriced * amountBought  * currentPrice)



    return profit;
  }
