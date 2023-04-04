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
          row.CallGEX = row.callGamma * row.callOpenInterest * 100 * spotPrice * spotPrice * 0.01;
          row.PutGEX = row.putGamma * row.putOpenInterest * 100 * spotPrice * spotPrice * 0.01 * -1;
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

    
    
    for (let data of dataset) {
        let daysTillExp = (new Date(data.expiry).getTime() - new Date(todayDate).getTime()) / oneDayInMilliseconds;
        let businessDaysTillExp = countBusinessDays(new Date(todayDate), new Date(data.expiry));
        data.daysTillExp = businessDaysTillExp === 0 ? 1 / businessDaysPerYear : businessDaysTillExp / businessDaysPerYear;
        data.nextExpiry = new Date(Math.min(...dataset.map(d => new Date(d.expiry).getTime())));
    }
    
  

    let nextExpiry : string = filteredDataSet[0].expiry;
    for (let entry of dataset) {
        if (entry.expiry < nextExpiry) {
            nextExpiry = entry.expiry;
        }
    }
    

    for (let data of dataset) {
        const expDate = new Date(data.expiry);
        data.IsThirdFriday = isThirdFriday(expDate);
    }
      
    const thirdFridays : any = dataset.filter(data => data.IsThirdFriday);
    const nextMonthlyExp : string = moment(new Date(Math.min(...thirdFridays.map((data : any) => new Date(data.expiry))))).format('YYYY-MM-DD');
    nextExpiry = moment(nextExpiry).format('YYYY-MM-DD')

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

    for (let level of levels) {
        const levelData =  sortedData.map(({
            strike,
            callIV,
            callOpenInterest,
            putIV,
            putOpenInterest,
            daysTillExp,
            nextExpiry,
            nextMonthlyExp,
            expiry
        } : any) => {
            const callGammaEx = calculateGammaExposure(level, strike, callIV, daysTillExp, 0, 0, "call", callOpenInterest);
            const putGammaEx = calculateGammaExposure(level, strike, putIV, daysTillExp, 0, 0, "put", putOpenInterest);
            return {
                callGammaEx,
                putGammaEx,
                expiry:expiry
            };
        })

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