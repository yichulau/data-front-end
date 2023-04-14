import moment from 'moment';
import _ from 'lodash';

const isThirdFriday = (d: any) => {
    return d.getDay() === 5 && d.getDate() >= 15 && d.getDate() <= 21;
}

const calculateGammaExposure = (S:any, K:any, vol:any, T:any, r:any, q:any, optType:any, OI:any) =>{
    if (T === 0 || vol === 0) {
        return 0;
      }
    
      const dp = (Math.log(S / K) + (r - q + 0.5 * vol ** 2) * T) / (vol * Math.sqrt(T));
      const dm = dp - vol * Math.sqrt(T);
    
      const normPdf = (x:any) => {
        return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
      };
    
      if (optType === 'call') {
        const gamma = Math.exp(-q * T) * normPdf(dp) / (S * vol * Math.sqrt(T));
        return OI * 100 * S * S * 0.01 * gamma;
      } else {
        const gamma = K * Math.exp(-r * T) * normPdf(dm) / (S * S * vol * Math.sqrt(T));
        return OI * 100 * S * S * 0.01 * gamma;
      }
}

const countBusinessDays = (fromDate: any, toDate: any) => {
    let days = 0;
    let currentDate = new Date(fromDate);
    while (currentDate < toDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
            days++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
}

const filterDataSetHelper = (arr: any[]) => {
    const data : any[] = [];
    arr.forEach((item: any) => {
        item.data.forEach((obj: any) => {
            data.push({...obj, expiry: item.expiry});
        });
    });

    return data
}

const linspace = (start:any, end:any, num:number) => {
    const step = (end - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + i * step);
}

// Calculate Absolute Gamma Exposure Graph 1, 2
export const calculateAbsoluteGammaExposure = (filteredDataSet: any[], spotPrice: number) =>{
    filteredDataSet.forEach(({ data }) => {
        data.forEach((row : any) => {
          row.CallGEX =  (row.callTradeGamma ? row.callTradeGamma : row.callGamma) * row.callOpenInterest * 100 * spotPrice * spotPrice * 0.01;
          row.PutGEX = (row.putTradeGamma ? row.putTradeGamma : row.callGamma) * row.putOpenInterest* 100 * spotPrice * spotPrice * 0.01 * -1;
          row.TotalGamma = (row.CallGEX + row.PutGEX) / Math.pow(10, 9);
        });
    });

    const dfAgg = filteredDataSet.reduce((acc, { data }) => {
        data.forEach((row : any) => {
          const strike = row.strike;
          if (!acc[strike]) {
            acc[strike] = {
              CallGEX: 0,
              PutGEX: 0,
              TotalGamma: 0
            };
          }
          acc[strike].CallGEX += row.CallGEX;
          acc[strike].PutGEX += row.PutGEX;
          acc[strike].TotalGamma += row.TotalGamma;
        });
        return acc;
      }, {});
    
    const strikes : any= Object.keys(dfAgg).map(key => parseInt(key));

    return {dfAgg, strikes}

}


// Calculate Zero Gamma Level based on the spot, Graph 3
export const calculateZeroGammaLevel = (filteredDataSet: any[], spotPrice: number) =>{
    const fromStrike = 0.3* spotPrice;
    const toStrike = 1.5 * spotPrice;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const businessDaysPerYear = 262;
    const levels = linspace(Number(fromStrike.toFixed(2)), Number(toStrike.toFixed(2)), 60);
    const todayDate = new Date();
    const dataset : any[] = filterDataSetHelper(filteredDataSet)
    const totalGamma  :any[]= [];
    const totalGammaExNext :any[] = [];
    const totalGammaExFri :any[] = [];
    const sortedData = dataset.sort((a:any, b:any) => {
        if (a.expiry < b.expiry) {
            return -1;
        } else if (a.expiry > b.expiry) {
            return 1;
        } else {
            return a.strike - b.strike;
        }
    });

    let nextExpiry : string = filteredDataSet[0].expiry;

    // console.log(dataset)
    for (let data of dataset) {
       
        const businessDaysTillExp = countBusinessDays(new Date(todayDate), new Date(data.expiry));
        const expDate = new Date(data.expiry);
        data.IsThirdFriday = isThirdFriday(expDate);
        data.daysTillExp = businessDaysTillExp === 0 ? 1 / businessDaysPerYear : businessDaysTillExp / businessDaysPerYear;
        data.nextExpiry = new Date(Math.min(...dataset.map(d => new Date(d.expiry).getTime())));
        if (data.expiry < nextExpiry) {
            nextExpiry = data.expiry;
        }
        
    }

    const thirdFridays : any = dataset.filter(data => data.IsThirdFriday);
    const nextMonthlyExp : string = moment(new Date(Math.min(...thirdFridays.map((data : any) => new Date(data.expiry))))).format('YYYY-MM-DD');
    nextExpiry = moment(nextExpiry).format('YYYY-MM-DD')

    // console.log(sortedData)
    for (let level of levels) {
        const levelData =  sortedData.map(({
            strike,
            callIV,
            callOpenInterest,
            putIV,
            putOpenInterest,
            daysTillExp,
            putDDOI,
            callDDOI,
            nextExpiry,
            nextMonthlyExp,
            callTradeGamma,
            putTradeGamma,
            expiry
        } : any) => {
            const callGammaEx = calculateGammaExposure(level, strike, callIV, daysTillExp, 0, 0, "call", callDDOI ? callDDOI :callOpenInterest);
            const putGammaEx = calculateGammaExposure(level, strike, putIV, daysTillExp, 0, 0, "put", putDDOI ? putDDOI : putOpenInterest);
            return {
                callGammaEx,
                putGammaEx,
                expiry:expiry
            };
        })
        // console.log(levelData, "levelData")
        totalGamma.push(_.sumBy(levelData, 'callGammaEx') - _.sumBy(levelData, 'putGammaEx'));
        const exNxt = levelData.filter(({ expiry }) => expiry !== nextExpiry);
        totalGammaExNext.push(_.sumBy (exNxt, 'callGammaEx') - _.sumBy(exNxt, 'putGammaEx'));
        const exFri = levelData.filter(({ expiry }) => expiry !== nextMonthlyExp);
        totalGammaExFri.push(_.sumBy(exFri, 'callGammaEx') - _.sumBy(exFri, 'putGammaEx'));
      
    }

    const totalGammaNormalized : any = totalGamma.map(value => value / 10 ** 9);
    const totalGammaExNextNormalized = totalGammaExNext.map(value => value / 10 ** 9);
    const totalGammaExFriNormalized = totalGammaExFri.map(value => value / 10 ** 9);
    const zeroCrossIdx = totalGammaNormalized.reduce((acc:any, value:any, idx:any) => {
        if (idx > 0 && Math.sign(value) !== Math.sign(totalGammaNormalized[idx - 1])) {
            acc.push(idx);
        }
        return acc;
    }, []);
    // console.log(totalGamma,totalGammaNormalized, "totalGammaNormalized")

    const negGamma = zeroCrossIdx.map((idx : any) => totalGammaNormalized[idx]);
    const posGamma = zeroCrossIdx.map((idx : any) => totalGammaNormalized[idx + 1]);
    const negStrike = zeroCrossIdx.map((idx : any) => levels[idx]);
    const posStrike = zeroCrossIdx.map((idx : any) => levels[idx + 1]);
    const zeroGamma = posStrike - ((posStrike - negStrike) * posGamma / (posGamma - negGamma));


    return {
        levels, 
        totalGammaNormalized, 
        totalGammaExNextNormalized, 
        totalGammaExFriNormalized, 
        todayDate, 
        spotPrice, 
        zeroGamma, 
        fromStrike, 
        toStrike 
    }

}

// get all trades data 
// 

export const calculateZeroGammaTrade = (trades :any[] , spotPrice : number) => {
    const fromStrike = 0.3* spotPrice;
    const toStrike = 1.5 * spotPrice;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const businessDaysPerYear = 262;
    const levels = linspace(Number(fromStrike.toFixed(2)), Number(toStrike.toFixed(2)), 60);
    const todayDate = new Date();

    const buyTrades = trades.filter((trade : any) => trade.direction === "Buy");
    const sellTrades = trades.filter((trade : any) => trade.direction === "Sell");


    console.log(buyTrades)
    // const dataset : any[] = filterDataSetHelper(trades)
    // const totalGamma  :any[]= [];
    // const totalGammaExNext :any[] = [];
    // const totalGammaExFri :any[] = [];
    // const sortedData = dataset.sort((a:any, b:any) => {
    //     if (a.expiry < b.expiry) {
    //         return -1;
    //     } else if (a.expiry > b.expiry) {
    //         return 1;
    //     } else {
    //         return a.strike - b.strike;
    //     }
    // });


    // {
    //     "ID": 236427,
    //     "coinCurrencyID": 1,
    //     "instrumentID": "BTC-28APR23-31500-P",
    //     "tradeID": "2f16ee6a-d36e-57a1-8288-528bc67192a5",
    //     "tradeTime": 1681397800,
    //     "direction": "Buy",
    //     "positionQuantity": "0.15000",
    //     "orderPrice": "1720.00000",
    //     "indexPrice": null,
    //     "priceChangeDirection": null,
    //     "isBlockTrade": 0,
    //     "openInterest": 27.64,
    //     "iv": 0.5019,
    //     "daysTillExp": 0.05343511450381679
    // }
    const totalGamma  :any[]= [];
    const totalGammaExNext :any[] = [];
    const totalGammaExFri :any[] = [];

    for (let level of levels){
        const buyLevelData : any = buyTrades.map(({
            instrumentID,
            direction,
            iv,
            daysTillExp,
            positionQuantity,
            openInterest
        } :any) => {
            const  { coin , strike, expiry, optionType} : any = extractInstrumentData(instrumentID)
            const expiryDate = formatDate(expiry);
            const callGEX = calculateGammaExposure(level, strike, iv, daysTillExp, 0, 0, "call", openInterest);
            const putGEX = calculateGammaExposure(level, strike, iv, daysTillExp, 0, 0, "put", openInterest);
            return {
                callGEX,
                putGEX,
                expiryDate
            }
        })
        const sellLevelData : any = sellTrades.map(({
            instrumentID,
            direction,
            iv,
            daysTillExp,
            positionQuantity,
            openInterest
        } :any) => {
            const  { coin , strike, expiry, optionType} : any = extractInstrumentData(instrumentID)
            const optType = optionType === "C" ? "call" : "put";
            const expiryDate = formatDate(expiry);
            const callGEX = calculateGammaExposure(level, strike, iv, daysTillExp, 0, 0, "call", openInterest);
            const putGEX = calculateGammaExposure(level, strike, iv, daysTillExp, 0, 0, "put", openInterest);
            return {
                callGEX,
                putGEX,
                expiryDate
            }
        })
        // console.log(buyLevelData, "buyLevelData")
        const aggregatedBuyTrades = aggregateAverageTradesGEX(buyLevelData);
        const aggregatedSellTrades = aggregateAverageTradesGEX(sellLevelData);
        const aggregatedTrades = mergeAndSumTradesGEX(aggregatedBuyTrades, aggregatedSellTrades);
        const {callGEX, putGEX} = aggregatedTrades.reduce((acc, item) => {
            acc.callGEX += item.callGEX;
            acc.putGEX += item.putGEX;
            return acc;
        }, { callGEX: 0, putGEX: 0, all: 0 });

        totalGamma.push(callGEX - putGEX);

    }
    const totalGammaNormalized : any = totalGamma.map(value => value / 10 ** 9);
    console.log(totalGamma,totalGammaNormalized)

  
}

export const extractInstrumentData = (instrumentID: string) =>{

    const match = instrumentID.match(/([A-Z]+)(?:-USD)?-?(\d{1,2}(?:[A-Z]{3}|\d{2})\d{2})-(\d+)-([C|P])/);
    if (!match) return null;
    return {
      coin: match[1],
      expiry: match[2],
      strike: match[3],
      optionType: match[4]
    };
}

export const formatDate = (dateStr: string) => {
    // const inputFormat = exchange === 'Binance' || exchange === 'OKEX' ? 'YYMMDD' : 'DDMMMYY';
    const inputFormat = 'DDMMMYY';
    const dateObj = moment(dateStr, inputFormat).toDate();
    const formattedDate = moment(dateObj).format('YYYY-MM-DD');
    return formattedDate;
}

function aggregateAverageTradesGEX(data:any) {
    const aggregatedData = data.reduce((acc:any, item:any) => {
        if (!acc[item.expiryDate]) {
            acc[item.expiryDate] = {
                callGEX: 0, 
                putGEX: 0, 
                count: 0
            };
        }

        acc[item.expiryDate].callGEX += item.callGEX;
        acc[item.expiryDate].putGEX += item.putGEX;
        acc[item.expiryDate].count += 1;

        return acc;
    }, {});

    return Object.entries(aggregatedData).map(([expiryDate, { callGEX, putGEX, count }] : any) => ({
        callGEX: callGEX / count,
        putGEX: putGEX / count,
        expiryDate
    }));
}

const mergeAndSumTradesGEX = (dataset1 : any , dataset2 : any) => {
    const combinedData = [...dataset1, ...dataset2];

    const aggregatedData = combinedData.reduce((acc, item) => {
        if (!acc[item.expiryDate]) {
            acc[item.expiryDate] = { callGEX: 0, putGEX: 0 };
        }
        acc[item.expiryDate].callGEX += item.callGEX;
        acc[item.expiryDate].putGEX += item.putGEX;
        return acc;
    }, {});

    return Object.entries(aggregatedData).map(([expiryDate, { callGEX, putGEX }] : any) => ({
        callGEX,
        putGEX,
        expiryDate
    }));
}