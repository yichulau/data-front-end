import moment from "moment";
import BlackScholes from "./blackScholes";

export const chartDataHelper = (dataArray: any[], dateChange: any) =>{
    let newResultArr : any = [];
    dataArray.map((item : any)=>{
        const instrumentType = item.callOrPut;
        const instrumentStrikePrice = Number(item.strike)
        const amount = item.amount;
        const strikePrice = instrumentStrikePrice;
        const type = instrumentType;
        const currencyType = item.instrumentName.substring(0,3)
        const underlyingPrice = item.underlyingPrice
        const expiryData = item.expiry
        const currentDate  = moment().valueOf();
        const expiryDate =  moment(expiryData).valueOf();;
        const diffMs = expiryDate - currentDate
        const diffDays = dateChange;
        const buyOrSellVal = item.position === 'Long' ? 1 : -1
        let optionPriceObject = {
          stockPrice: underlyingPrice,
          interestRate: 0.02,
          buyOrSell: item.position === 'Long' ? "buy" : "sell",
          quantity: amount,
          type: type === 'C' ? "call" : "put",
          strike: strikePrice,
          daysToExpiry: diffDays >= 0 ? diffDays : 0,
          volatility: 0.64,
          credit: 0
        }
        let blackScholes = new BlackScholes(optionPriceObject)
        let price = blackScholes.price()
        optionPriceObject.credit = buyOrSellVal * price * parseInt(amount)
        newResultArr.push(optionPriceObject)
    })
    return newResultArr;
}

export const optionsGenerateDataHelper = (dataSet: any) =>{

    const output = dataSet.optionsData.map((option : any) => {
        const x = option.x;
        const optionsDataY = option.y;
        const optionsDataAtExpiryY = dataSet.optionsDataAtExpiry.find((optionAtExpiry : any)=> optionAtExpiry.x === x)?.y;
        const stockDataY = dataSet.stockData.find((stock : any) => stock.x === x)?.y;
        return { x, optionsData: optionsDataY, optionsDataAtExpiry: optionsDataAtExpiryY, stockData: stockDataY };
      }).filter((option : any) => option.optionsDataAtExpiry !== undefined && option.stockData !== undefined);

    return output
}