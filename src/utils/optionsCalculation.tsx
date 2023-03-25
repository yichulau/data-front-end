import BlackScholes from "./blackScholes";


export const optionsCalculation = {
    getOptionsGraph
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



