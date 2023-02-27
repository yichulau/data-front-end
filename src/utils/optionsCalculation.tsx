import moment from "moment";
import {daysTillExpiry, getCurrentDate} from './date';
import BlackScholes from "./blackScholes";


export const optionsCalculation = {
    buyCallOption,
    sellCallOption,
    buyPutOption,
    sellPutOption,
    buyCallTimeDecayOption,
    sellCallTimeDecayOption,
    buyPutTimeDecayOption,
    sellPutTimeDecayOption,
    getOptionsGraph
}

interface OptionInputs {
  instrumentName: string;
  underlyingPrice: number;
  vega: number;
  theta: number;
  rho: number;
  gamma: number;
  delta: number;
  markPrice: number;
  type: string;
  expiry: string;
  initialPrice: number;
}

interface OptionParams {
  numContracts: number;
  contractMultiplier: number;
  currentPrice: number;
  strikePrice: number;
  cost: number;
}


function buyCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string) {

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = stockPricePercent;
    const diffStrikeExpiration = expiryPrice - strikePrice;
    const profit = expiryPrice >= strikePrice ? (diffStrikeExpiration  * amountBought)- (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)

    return profit;

    
  }

  function sellCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string){

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = stockPricePercent;
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice >= strikePrice ? (optionPriced * amountBought * currentPrice) - (diffStrikeExpiration  * amountBought) : ( optionPriced * amountBought  * currentPrice)


    return profit;
  }
  

  function buyPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string){


    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = stockPricePercent;
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice <= strikePrice ? -(diffStrikeExpiration  * amountBought) - (optionPriced * amountBought * currentPrice) : -( optionPriced * amountBought  * currentPrice)


    return profit;
  }


	
  function sellPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number, exchange: string){

    const optionPriced = exchange === 'Bybit' || exchange === 'Binance' ? optionPrice / currentPrice : optionPrice;
    const amountBought = Number(amount)
    const expiryPrice = stockPricePercent;
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice <= strikePrice ? (diffStrikeExpiration  * amountBought) + (optionPriced * amountBought * currentPrice) : ( optionPriced * amountBought  * currentPrice)



    return profit;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // time Decay calculation
  function buyCallTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, type: string, expiry: string, markIv: any, underlyingPrice: number, thetaVal : number,gammaVal : number, vegaVal : number, deltaVal : number, rhoVal : number, optionLastPrice: number, position: any, high24 : any, low24: any ,daysDiff: any, optionType: any, mul: any) {
    // const vol = iv.getImpliedVolatility(
    //   optionPrice, stockPricePercent, strikePrice, daysDiff/365, 0.05, optionType
    // );
    // const optionPrices = bs.blackScholes(
    //   stockPricePercent, 
    //   strikePrice,
    //   daysDiff/365,
    //   vol,
    //   0.05,
    //   optionType
    // );
    //   // let optionPrices = BlackScholes(
    //   //   optionType,
    //   //   stockPricePercent,
    //   //   strikePrice,
    //   //   daysDiff/365,
    //   //   0.05,
    //   //   vol
    //   // )
    // let profit = mul * round((optionPrices - optionPrice) * amount)

    // return profit;
  }

  function sellCallTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, type: string, expiry: string, markIv: any, underlyingPrice: number, thetaVal : number,gammaVal : number, vegaVal : number, deltaVal : number, rhoVal : number, optionLastPrice: number, position: any, high24 : any, low24: any,daysDiff: any, optionType: any, mul: any) {
    // const vol = iv.getImpliedVolatility(optionPrice, stockPricePercent, strikePrice, daysDiff/365, 0.05, optionType);
    // const optionPrices = bs.blackScholes(
    //   stockPricePercent, 
    //   strikePrice,
    //   daysDiff/365,
    //   vol,
    //   0.05,
    //   optionType
    // );
    // const profit = mul * round((optionPrices - optionPrice) * amount)
    // return profit;
  
  }

  
  function buyPutTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, type: string, expiry: string, markIv: any, underlyingPrice: number, thetaVal : number,gammaVal : number, vegaVal : number, deltaVal : number, rhoVal : number, optionLastPrice: number, position: any, high24 : any, low24: any ,daysDiff: any, optionType: any, mul: any) {

    // const vol = iv.getImpliedVolatility(optionPrice, stockPricePercent, strikePrice, daysDiff/365, 0.05, optionType);

    // const optionPrices = bs.blackScholes(
    //   stockPricePercent, 
    //   strikePrice,
    //   daysDiff/365,
    //   vol,
    //   0.05,
    //   optionType
    // );

    // const profit = mul * round((optionPrices - optionPrice) * amount)


    // return profit;
  }



  function sellPutTimeDecayOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number , exchange: string, type: string, expiry: string, markIv: any, underlyingPrice: number, thetaVal : number,gammaVal : number, vegaVal : number, deltaVal : number, rhoVal : number, optionLastPrice: number, position: any, high24 : any, low24: any ,daysDiff: any, optionType: any, mul: any) {
    // const vol = iv.getImpliedVolatility(optionPrice, stockPricePercent, strikePrice, daysDiff/365, 0.05, optionType);
    // const optionPrices = bs.blackScholes(
    //   stockPricePercent, 
    //   strikePrice,
    //   daysDiff/365,
    //   vol,
    //   0.05,
    //   optionType
    // );

    // const profit = mul * round((optionPrices - optionPrice) * amount)
    // return profit;
  }


  function getOptionsGraph(data : any, interval:any){
    let optionsData : any= {};
    let stockData : any= {};
    let optionsDataAtExpiry: any = {};
    
    // process range of graph
    var min = 0;
    var max = interval === 50? parseFloat(data[0].strike)*4 : parseFloat(data[0].strike)*2 ;
    for(var i = 1; i<Object.keys(data).length; i++){
      var option = data[i];
      if(parseFloat(option.stockPrice) < min){
        min = parseFloat(option.strike);
      }
      if(parseFloat(option.stockPrice) > max){
        max = parseFloat(option.strike);
      }
    }

    var mid = (min + max)/2;
    // generate prices for every stock price
    for(var i = min - 0.001 ; i < max + 4 * mid; i += interval){
      for(var j = 0; j<Object.keys(data).length; j++){

        var option = data[j];

        let copy = {
          ...option
        };

        if(copy.buyOrSell == 'buy'){
          var buyOrSell = 1;
        }else{
          var buyOrSell = -1;
        }

        // baseline price
        var originalPrice = (new BlackScholes(copy)).price();

        // find price of option now
        copy.stockPrice = i;
        var copyPrice = (new BlackScholes(copy)).price();
        if(!(i in optionsData)){
          optionsData[i] = option.quantity * buyOrSell * (copyPrice - originalPrice);
        }else{
          optionsData[i] += option.quantity * buyOrSell * (copyPrice - originalPrice);
        }

        // find price of stock itself
        if(!(i in stockData)){
          stockData[i] = option.quantity * buyOrSell * (i - option.stockPrice);
        }else{
          stockData[i] += option.quantity * buyOrSell * (i - option.stockPrice);
        }        
 
        // find price of option in to the future
        copy.daysToExpiry = 0;
        var expiryPrice = (new BlackScholes(copy)).price();  
        if(!(i in optionsDataAtExpiry)){
          optionsDataAtExpiry[i] = option.quantity * buyOrSell * (expiryPrice - originalPrice);
        } else {
          optionsDataAtExpiry[i] += option.quantity * buyOrSell * (expiryPrice - originalPrice);
        }
      }
    }

    // change back to usable format
    optionsData = organizeData(optionsData);
    stockData = organizeData(stockData)
    optionsDataAtExpiry = organizeData(optionsDataAtExpiry);
    return {optionsData, stockData, optionsDataAtExpiry}
  }

  function organizeData(optionsData : any){
    var data = []
    for(const i in optionsData){
      data.push( { x : parseFloat(i), y : optionsData[i] } );
    }
    return data;
  }



  // Round a number to 2 decimal points
const round = (num: any) => {
  return Math.round((num + Number.EPSILON) * 100)/100;
}

// Round a number to 1 decimal point
const roundOne = (num: any) => {
  return Math.round((num + Number.EPSILON) * 10)/10;
}


  // Set end point of the chart as 30% above the stock price
  const getHigh = (price: any, high: any) => {
    return price + price/3;
  }

  // Set end point of the chart as 30% above the stock price
  const getLow = (price: any, low: any) => {
    return price - price/3;
  }
