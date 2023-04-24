import React, { ChangeEvent, MouseEvent , useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import GammaTable from '../../components/gamma/GammaTable';
import useFetchGamma from '../../hooks/useFetchGamma';
import GammaFilterDropdown from '../../components/gamma/GammaFilterDropdown';
import AbsoluteGammaExposureChart from '../../components/gamma/AbsoluteGammaExposureChart';
import AbsoluteGammaCallsPutsChart from '../../components/gamma/AbsoluteGammaCallsPutsChart';
import GammaExposureProfileChart from '../../components/gamma/GammaExposureProfileChart';
import ribbonImg from "../../../public/assets/ribbon-logo.png";
import { Responsive, WidthProvider } from 'react-grid-layout';
import { gammaUrls } from '../../utils/gamma-urls';
import { gammaCoinExchangeOption, exchangeOption } from '../../utils/selector';
import { calculateAbsoluteGammaExposure, calculateZeroGammaLevel, calculateZeroGammaTrade, extractInstrumentData } from '../../utils/gammaExposureCalculation';
import { serverHost } from '../../utils/server-host';
import moment from 'moment';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { contractTraded } from '../../utils/contract-traded-urls';
import useFetchContractData from '../../hooks/useFetchContractData';
import BlackScholes from '../../utils/blackScholes';
import ADGammaExposureProfileChart from '../../components/gamma/ADGammaExposureProfileChart';


interface Metrics {
    ddoi: number;
    longGamma: number;
    shortGamma: number;
    longTotal: number;
    shortTotal: number;
    optionType: string;
    openInterest: any
}

interface FetchContractDataResult {
    data: any; //
    error: Error | null; 
    loading: boolean;
}

interface FetchGammaDataResult {
    data: any; //
    error: Error | null; 
    loading: boolean;
}

type InstrumentData = { 
    coin: string; 
    expiry: string; 
    strike: string; 
    optionType: string; 
} | null;
  



const GammaExposure = () => {
    const urls = gammaUrls.urls
    const contractUrls = contractTraded.urls
    const ResponsiveGridLayout : any = useMemo(() => WidthProvider(Responsive), []);
    const {data , error, loading } : FetchGammaDataResult = useFetchGamma(urls);
    const {data: contractData, error: contractError, loading: contractLoading } : FetchContractDataResult = useFetchContractData(contractUrls);
    const [currency, setCurrency] = useState('')
    const [exchange, setExchange] = useState('')
    const [filterData, setFilterData] = useState([])  
    const [spotPrice, setSpotPrice] = useState(0)
    const [dfAgg, setDfAgg] = useState()
    const [strikes, setStrikes] = useState()
    const [dfAggTrade, setDfAggTrade] = useState()
    const [strikesTrade, setStrikesTrade] = useState()
    const [width, setWidth] = useState<any>(undefined);
    const [zeroGammaLevelData, setZeroGammaLevelData] = useState({})
    const [zeroGammaLevelTradeData, setZeroGammaLevelTradeData] = useState({})
    const [toggle, setToggle] = useState(false)
    const [toggleDataset, setToggleDataSet] = useState<any>([])
    const [errorFlag, setErrorFlag] = useState(false)
    const [layouts, setLayout] = useState<any>([
        { i: 'table1', x: 0, y: 1, w: 6, h: 13, minW: 4 },
        { i: 'table2', x: 6, y: 1, w: 6, h: 13, minW: 4 },
        { i: 'table3', x: 0, y: 0, w: 12, h: 13, minW: 4 },
        { i: 'table4', x: 0, y: 4, w: 12, h: 24, minW: 4 },
        { i: 'table5', x: 0, y: 3, w: 6, h: 13, minW: 4 },
        { i: 'table6', x: 6, y: 3, w: 6, h: 13, minW: 4 },
        { i: 'table7', x: 0, y: 2, w: 12, h: 13, minW: 4 },
    ]);

    const [adgraph,setadGraph] = useState<any[]>([])


    const getSpotPrice = (value: string) =>{
        let spotVal = `https://${serverHost.hostname}/api/v1.0/${value.toLowerCase()}/spotval`;
        return fetch(spotVal)
            .then(response => {
            if (!response.ok) {
                const message = `An error has occurred: ${response.status}`;
                throw new Error(message);
            }
                return response.json();
            })
            .then(data => {
                localStorage.setItem(value.toLowerCase(),data.spotValue)
                setSpotPrice(data.spotValue)
                return data;
            })
            .catch(error => {
            throw new Error(error.message);
            });
    }

    const calculateMetrics = (trades:any) =>{
   
        const metricsByInstrument :  { [key: string]: Metrics } = {};
      
        trades.forEach((trade :any) => {
          const { instrumentID, direction, positionQuantity, gamma, side, amount , quantity, openInterest } = trade;
          const directionValue = direction === "Buy" || direction === "buy" || side === "buy" ? 1 : -1;
          const ddoi = exchange === "OKEX" || exchange === "Binance" ? parseFloat(quantity) * directionValue : exchange === "Deribit" ?  parseFloat(amount) * directionValue :  parseFloat(positionQuantity) * directionValue;
          const netAmount : any = exchange === "OKEX" || exchange === "Binance" ? Number(quantity): exchange === "Deribit" ?  Number(amount) :  Number(positionQuantity);

          if (!metricsByInstrument[instrumentID]) {
            metricsByInstrument[instrumentID] = {
              ddoi: 0,
              longGamma: 0,
              shortGamma: 0,
              longTotal: 0,
              shortTotal: 0,
              optionType: instrumentID.split('-')[3],
              openInterest: openInterest ? openInterest : 0
            };
          }
      
          metricsByInstrument[instrumentID].ddoi += ddoi;
      
          if (direction === "Buy" || direction === "buy" || side === "buy") {
            metricsByInstrument[instrumentID].longGamma += parseFloat(gamma);
            metricsByInstrument[instrumentID].longTotal += parseFloat(netAmount);
          } else if (direction === "Sell" || direction === "sell" || side === "sell") {
            metricsByInstrument[instrumentID].shortGamma += parseFloat(gamma);
            metricsByInstrument[instrumentID].shortTotal += parseFloat(netAmount);
          }
        });
        const metricsArray = Object.entries(metricsByInstrument).map(([instrumentID, metrics] : [string, Metrics]) => {
          const { ddoi, optionType, longTotal, shortTotal, openInterest } = metrics;
        //   row.CallGEX =  (row.callTradeGamma ? row.callTradeGamma : row.callGamma) * row.callOpenInterest * 100 * spotPrice * spotPrice * 0.01;
        //   row.PutGEX = (row.putTradeGamma ? row.putTradeGamma : row.callGamma) * row.putOpenInterest* 100 * spotPrice * spotPrice * 0.01 * -1;
          const longGamma = metrics.longGamma ? metrics.longGamma * openInterest * 100 * spotPrice * spotPrice * 0.01 : 0;
          const shortGamma = metrics.shortGamma ? metrics.shortGamma * openInterest * 100 * spotPrice * spotPrice * 0.01 * -1: 0;
          return {
            instrumentID,
            ddoi,   
            shortGamma,
            longGamma,
            totalTradeGamma: (shortGamma + longGamma) / Math.pow(10, 9),
            optionType, 
            dealerTotalInventory: longTotal + shortTotal,
            dealerNetInventory: longTotal - shortTotal,
          };
        });
      
        return metricsArray;
    }


    const formatDate = (dateStr: string) => {
        const inputFormat = exchange === 'Binance' || exchange === 'OKEX' ? 'YYMMDD' : 'DDMMMYY';
        const dateObj = moment(dateStr, inputFormat).toDate();
        const formattedDate = moment(dateObj).format('YYYY-MM-DD');
        return formattedDate;
    }
    
    


    const mergeDatasets = (dataset1:any, dataset2:any)=> {
        const dataset2Data = new Map();
        
        dataset2.forEach((expiryData:any) => {
            expiryData.data.forEach((item:any) => {
                const key = `${expiryData.expiry}-${item.strike}`;
                dataset2Data.set(key, item);
            });
        });

        return dataset1.map((item:any) => {
            const { coin , strike, expiry, optionType} : any = extractInstrumentData(item.instrumentID);
            const regex = exchange === 'Binance' || exchange === 'OKEX' ? /([0-9]{2})([0-9]{2})([0-9]{2})/ : /([0-9]{1,2})([A-Z]{3})([0-9]{2})/
            const date = item.instrumentID.match(regex)[0];
            const formattedDate = formatDate(date);
            const strikeNum = parseInt(strike, 10);
            const key = `${formattedDate}-${strikeNum}`;
            const matchingData = dataset2Data.get(key);
            const businessDaysPerYear = 262;
            const currentDate  = moment().valueOf();
            const expiryDate =  moment(formattedDate).valueOf();
            const diffDays = Math.ceil((expiryDate - currentDate) / (24 * 60 * 60 * 1000)) 
            const businessDaysTillExp = diffDays > 0 ? diffDays : 0;
            const daysTillExp = businessDaysTillExp === 0 ? 1 / businessDaysPerYear : businessDaysTillExp / businessDaysPerYear;


            if (matchingData) {
                const iv = exchange === 'Deribit' ? item.iv :  optionType === 'P' ? matchingData.putIV : matchingData.callIV;
                item.openInterest = optionType === 'P' ? matchingData.putOpenInterest : matchingData.callOpenInterest;
                item.iv = iv;
                item.daysTillExp = daysTillExp
            }
    
            return item;
        });
    }

    const constructGammaArray = (mergedDataset : any) => {
        return mergedDataset.map((item:any)=>{
            const {
                instrumentID,
                direction,
                positionQuantity,
                orderPrice,
                isBlockTrade,
                iv,
                openInterest,
                indexPrice,
                daysTillExp
            } = item;
            const [, strike, type] = instrumentID.match(/(\d+)-([CP])/);
            const regex = exchange === 'Binance' || exchange === 'OKEX' ? /([0-9]{2})([0-9]{2})([0-9]{2})/ : /([0-9]{1,2})([A-Z]{3})([0-9]{2})/
            const date = instrumentID.match(regex)[0];
            const isCallOption = exchange === 'Binance' || exchange === 'OKEX' ? instrumentID.split('-')[4] === 'C'  : instrumentID.split('-')[3] === 'C';
            const formattedDate = formatDate(date);
            const inputData = {
                type: isCallOption ? "call" : "put",
                stockPrice: spotPrice,
                strike: strike,
                daysToExpiry: daysTillExp * 365,
                interestRate: 0,
                volatility: iv
            };

            const gamma = new BlackScholes(inputData)
            return {
                ...item,
                gamma: gamma.gamma(),
                // delta : gamma.delta()
            }
        }) 
    }

    const computeGammaData = (gammaData:any) =>{
        const {dfAgg, strikes} = calculateAbsoluteGammaExposure(gammaData, spotPrice)
        const zeroGammaLevel = calculateZeroGammaLevel(gammaData,  spotPrice)
        setDfAgg(dfAgg)
        setStrikes(strikes)
        setZeroGammaLevelData(zeroGammaLevel)
       
    }

    const computeGammaTradeData =  (gammaData:any) => {

        
        const instrumentLookup : any = {};
        const currencies = currency.toLowerCase() === 'btc' ? 1 : 2

        const { result24H : contractsData } = contractData.filter((obj : any) => obj.currency === currency.toLowerCase() && obj.exchange === exchange.toLowerCase()).pop()

        const mergedDataset = mergeDatasets(contractsData,gammaData);
        const gammaArr = constructGammaArray(mergedDataset);
        const gammaMetrics : any = calculateMetrics(gammaArr.filter((obj : any) => obj.coinCurrencyID === currencies))
        // console.log(gammaArr)
        // console.log(gammaMetrics)
        const gammaLevelExpiration = computeTrialData(gammaMetrics) 
        const gammaLevelExpirationTrades = reformatTradesData(gammaArr);
        
        console.log("formatted data")
        console.log(gammaLevelExpiration)
        console.log(gammaLevelExpirationTrades)

        const gammaFinal = getOTMOptions(gammaLevelExpiration, gammaLevelExpirationTrades)

        console.log("gammaFinal data")
        console.log(gammaFinal)
        const gammaProfile = constructZeroGammaChart(gammaFinal, currency)
        console.log("gammaProfile data")
        console.log(gammaProfile)
        setadGraph(gammaProfile)
        // calculateZeroGammaTrade(mergedDataset, spotPrice)

        gammaMetrics.map((instrument: any) => {
            const { instrumentID, totalTradeGamma, ddoi } = instrument;
            const [, strike, type] = instrumentID.match(/(\d+)-([CP])/);
            const regex = exchange === 'Binance' || exchange === 'OKEX' ? /([0-9]{2})([0-9]{2})([0-9]{2})/ : /([0-9]{1,2})([A-Z]{3})([0-9]{2})/
            const date = instrumentID.match(regex)[0];
            const formattedDate = formatDate(date);
            const key = `${formattedDate}-${strike}-${type}`;
            instrumentLookup[key] = {
                totalTradeGamma,
                ddoi
            };
        });

   
        const gammaDataSet = gammaData.map((obj: any) => {
            return {
                ...obj,
                data: obj.data.map((item: any) => {
                  const callKey = `${obj.expiry}-${item.strike}-C`;
                  const putKey = `${obj.expiry}-${item.strike}-P`;
              
                  if (instrumentLookup.hasOwnProperty(callKey)) {
                    item.callDDOI = instrumentLookup[callKey].ddoi;
                    item.callTradeGamma = instrumentLookup[callKey].totalTradeGamma;
                  }
                  if (instrumentLookup.hasOwnProperty(putKey)) {
                    item.putDDOI = instrumentLookup[putKey].ddoi;
                    item.putTradeGamma = instrumentLookup[putKey].totalTradeGamma;
                  }
                  return item; 
                }),
            };
        });

        const {dfAgg, strikes} = calculateAbsoluteGammaExposure(gammaDataSet, spotPrice)
        const zeroGammaLevel = calculateZeroGammaLevel(gammaDataSet,  spotPrice)



        setDfAggTrade(dfAgg)
        setStrikesTrade(strikes)
        setZeroGammaLevelTradeData(zeroGammaLevel)
    }

    const computeTrialData = (gammaMetrics:any) =>{
        const currencies = currency.toLowerCase() === 'btc' ? 1 : 2

        let g = gammaMetrics.map((item:any) => {
            const data : any = extractInstrumentData(item.instrumentID)
            return {
                currency: data.coin,
                date: "1682035200000",
                expiration: moment.utc(data.expiry, 'DDMMMYY').add(8, 'hours').unix() +'000',
                strike: Number(data.strike),
                gammaLevel:Number(item.totalTradeGamma),
                callGammaExposure : Number(item.longGamma),
                putGammaExposure : Number(item.shortGamma),
                dealerNetInventory:item.dealerNetInventory,
                __typename:"gammaLevelsExpiration"
            }
        })

        const resultMap = g.reduce((accumulator : any, item : any) => {
            const key = `${item.expiration}-${item.strike}`;
        
            if (accumulator.has(key)) {
              accumulator.get(key).gammaLevel += item.gammaLevel;
            } else {
              accumulator.set(key, { ...item });
            }
        
            return accumulator;
          }, new Map());
        
        let y = Array.from(resultMap.values());

        // console.log(y,"hello")
        const df_gex = y.map((item : any) => {
            const date = moment(parseInt(item.date)).unix();
            const expiration = moment(parseInt(item.expiration)).unix();
            const dte = (expiration - date) / (60 * 60 * 24);
          
            return {
              ...item,
              date: date,
              expiration: expiration,
              dte: dte,
            };
        });

        return df_gex
        // let dfAgg : any = {};

        // y.map((entry : any) => {
        //     const strike = entry.strike.toString();
        //     dfAgg[strike] = {
        //         CallGEX: entry.callGammaExposure,
        //         PutGEX: entry.putGammaExposure,
        //         TotalGamma: entry.gammaLevel
        //     };
        // });

        // const strikes : any= Object.keys(dfAgg).map(key => parseInt(key));
        // console.log(dfAgg, "trial datsdsdsdsda")
        // console.log(y, "trial data")

       
        // return {dfAgg, strikes}
        // let y = []
        // let x = g.map((item : any)=>{
        //     if(item.strike )
        //     return {
        //         ...item,
        //         gammaLevel: item.gammaLevel * item.dealerNetInventory
        //     }
        // })

    }

    const reformatTradesData = (gammaArr : any[]) => {
        // const date_hour = moment.utc().startOf('hour').format('YYYY-MM-DD HH:00');
        const date_hour = '2023-04-24 06:00'
        console.log(date_hour)
        const res = gammaArr.map((item : any) => {
            const data : any = extractInstrumentData(item.instrumentID)
            return {
                date: item.tradeTime,
                expiration: moment.utc(data.expiry, 'DDMMMYY').unix(),
                putCall: data.optionType,
                underlyingPrice: item.indexPrice,
                strike: Number(data.strike),
                markIv: item.iv,
                spot: spotPrice,
                direction: item.direction,
                instrumentID: item.instrumentID,
                openInterest: item.openInterest
            }
        })
        const df_hifi = res.map(item => {
            let expiration = moment.unix(item.expiration).utc().hour(8).format('YYYY-MM-DD HH:00:00');
            let date = moment.unix(item.date).utc().format('YYYY-MM-DD HH:00');
            let underlyingPrice = parseFloat(item.underlyingPrice);
            
            return {
              ...item,
              expiration: expiration,
              date: date,
              underlyingPrice: underlyingPrice,
            };
        }).filter(item => item.date === date_hour);


        return df_hifi;
    }

    const constructZeroGammaChart = (df_final : any, currency : any) => {
        let min_price: number;
        let max_price;
        let prices : any[];

        if (currency.toUpperCase() === 'BTC') {
            min_price = Math.max(5000, Math.round((df_final[0].spot - 10000) / 10000) * 10000);
            max_price = Math.round((df_final[0].spot + 10000) / 10000) * 10000;
            prices = Array.from({ length: (max_price - min_price) / 250 + 1 }, (_, i) => min_price + i * 250);
        } else if (currency.toUpperCase() === 'ETH') {
            min_price = Math.max(500, Math.round((df_final[0].spot - 1000) / 1000) * 1000);
            max_price = Math.round((df_final[0].spot + 1000) / 1000) * 1000;
            prices = Array.from({ length: (max_price - min_price) / 25 + 1 }, (_, i) => min_price + i * 25);
        }
        let gammaProfile: any[] = [];

        const uniqueExpirations = [...new Set(df_final.map((item: any) => item.expiration))];

        uniqueExpirations.forEach(exp => {
            const df_final_exp = df_final.filter((item: any) => item.expiration === exp);

            prices.forEach(p => {
              df_final_exp.forEach((item: any) => {
                const inputData = {
                    type: item.putCall === "C" ? "call" : "put",
                    stockPrice: p,
                    strike: item.strike,
                    daysToExpiry: item.dte,
                    interestRate: 0,
                    volatility: item.markIv
                };
                item.gamma = new BlackScholes(inputData).gamma()
              });
          
              const gamma_sum = df_final_exp.reduce((acc : any, item : any) => {
                return acc + item.gamma * item.dealerNetInventory * p * p * 0.01;
              }, 0);
          
              gammaProfile.push({ expiration: exp, spot: p, usd_gamma: gamma_sum });
            });
        });
        return gammaProfile;
    }

    const getOTMOptions = (df_gex : any, df_hifi: any) => {
        const df_hifi_otm = df_hifi.map((item: any) => {
            let is_otm = '';
          
            if (
              (item.putCall === 'C' && item.underlyingPrice <= item.strike) ||
              (item.putCall === 'P' && item.underlyingPrice >= item.strike)
            ) {
              is_otm = 'otm';
            }
          
            return {
              ...item,
              is_otm: is_otm,
            };
          }).filter((item: any) => item.is_otm === 'otm');
          
          console.log(df_hifi_otm, 'df_hifi_otm')

        const df_gex_with_expiration_as_string = df_gex.map((item: any) => ({
            ...item,
            expiration: moment.unix(item.expiration).utc().hour(8).format('YYYY-MM-DD HH:00:00'),
        }));

        const df_final = df_gex_with_expiration_as_string.flatMap((item: any) => {
            return df_hifi_otm
                .filter(
                (hifi_item:any) =>
                    hifi_item.expiration === item.expiration && hifi_item.strike === item.strike
                )
                .map((hifi_item:any) => ({
                    ...item,
                    direction: hifi_item.direction,
                    openInterest: hifi_item.openInterest,
                    putCall: hifi_item.putCall,
                    markIv: hifi_item.markIv,
                    spot: hifi_item.spot,
                }));
        });

        return df_final

    }


    const onClickFilter = (event: MouseEvent<HTMLButtonElement>) =>{
        event.preventDefault()

        if(currency && exchange){
            setErrorFlag(false)
            const gammaData : any = data.filter((obj : any) => obj.currency === currency.toLowerCase() && obj.exchange === exchange.toLowerCase())
           
            computeGammaData(gammaData)
            computeGammaTradeData(gammaData)


            setFilterData(gammaData)
        } else{
            setErrorFlag(true)
        }
    }


//    useEffect(()=>{
//      function formatToggleDataSet() {
//         const uniqueKeys = new Set();
//         const categorizedData : any = {};

//         data.map((item:any)=>{
//             const key = `${item.exchange}_${item.currency}`;
//             uniqueKeys.add(key);

//             if (!categorizedData[key]) {
//                 categorizedData[key] = [];
//             }
//             categorizedData[key].push(item);
//         })

//         const array2D = Array.from(uniqueKeys).map((key : any) => categorizedData[key]);

//         setToggleDataSet(array2D);
//      }
   
//     formatToggleDataSet()

//    },[data])


   useEffect(()=>{
        if (typeof window !== 'undefined') {
            window.onresize = () => {
                setWidth(window.innerWidth);
            }
            setWidth(() => window.innerWidth);
            getSpotPrice("btc")
            getSpotPrice("eth")
        }
    },[])

  return (
    <>
    <div className="container py-1 mx-auto">
        <div className={strikes && dfAgg ? `w-full px-2.5` : `w-full px-2`}>
            <div className='flex flex-col bg-white dark:bg-black rounded-lg shadow-sm w-full px-4 py-4 '>
                <div className='flex gap-2'>
                    <GammaFilterDropdown 
                        title={`Coin Currency`}
                        options={gammaCoinExchangeOption}
                        onChange={(value:any) => {
                            getSpotPrice(value)
                            setCurrency(value)
                        }}
                    />
                    <GammaFilterDropdown 
                        title={`Exchange`}
                        options={exchangeOption}
                        onChange={(value: any) => setExchange(value)}
                    />
                    <button
                        className='text-white bg-green-700 hover:bg-green-800  font-medium rounded-lg text-xs md:text-sm px-4 md:px-5 py-2.5 text-center mr-2 mb-2'
                        onClick={onClickFilter}
                    >
                        Submit
                    </button>
                    {/* <div className='flex flex-col items-center justify-center'>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" onChange={()=> setToggle(!toggle)}/>
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div> */}
                </div>

                {errorFlag ? (
                    <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error Alert!</span> Please Make Sure Exchange and Currency Is Selected And Try Submitting Again.
                    </div>
                ): null }
            </div>

        </div> 
        {toggle === false ? (
            <div className='w-full'>
                {strikes && dfAgg ? (
                    <>  
                    {width > 764 ? (
                        <div className='w-full'>
                            <ResponsiveGridLayout
                                className="layout"
                                layouts={{ lg: layouts }}
                                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                                cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                                rowHeight={30}
                                margin={[10, 10]}
                                isResizable={true}
                                isDraggable={true}
                                draggableHandle=".drag-handle"
                                onLayoutChange={(newLayout: any ) => {
                                    setLayout(newLayout)
                                }}
                                useCSSTransforms={false}
                            >
                                <div key="table3" className="grid-item">
                                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                                            <GammaExposureProfileChart 
                                                zeroGammaLevelData={zeroGammaLevelData}
                                                spotPrice={spotPrice}
                                                currency={currency}
                                                exchange={exchange}
                                                width={width}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div key="table1" className="grid-item">
                                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                                            <AbsoluteGammaExposureChart 
                                                strikes={strikes}
                                                dfAgg={dfAgg}
                                                spotPrice={spotPrice}
                                                currency={currency}
                                                exchange={exchange}
                                                width={width}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div key="table2" className="grid-item">
                                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                                            <AbsoluteGammaCallsPutsChart 
                                                strikes={strikes}
                                                dfAgg={dfAgg}
                                                spotPrice={spotPrice}
                                                currency={currency}
                                                exchange={exchange}
                                                width={width}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div key="table7" className="grid-item">
                                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                                            {/* <GammaExposureProfileChart 
                                                zeroGammaLevelData={zeroGammaLevelTradeData}
                                                spotPrice={spotPrice}
                                                currency={currency}
                                                exchange={exchange}
                                                width={width}
                                                subTitle={`Trades`}
                                            /> */}
                                            <ADGammaExposureProfileChart
                                                data={adgraph}
                                                symbol={currency}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div key="table5" className="grid-item">
                                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                                            <AbsoluteGammaExposureChart 
                                                strikes={strikesTrade}
                                                dfAgg={dfAggTrade}
                                                spotPrice={spotPrice}
                                                currency={currency}
                                                exchange={exchange}
                                                width={width}
                                                subTitle={`Trades`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div key="table6" className="grid-item">
                                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                                            <AbsoluteGammaCallsPutsChart 
                                                strikes={strikesTrade}
                                                dfAgg={dfAggTrade}
                                                spotPrice={spotPrice}
                                                currency={currency}
                                                exchange={exchange}
                                                width={width}
                                                subTitle={`Trades`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div key="table4" className="grid-item">
                                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                                            <GammaTable data={filterData} loading={loading} spotPrice={spotPrice} currency={currency} width={width}/>
                                        </div>
                                    </div>
                                </div>
                            </ResponsiveGridLayout>
                    
                        </div>
                    ) : null }
                    {width <= 764 ? (
                        <>
                            <div className='w-full px-1'>
                                <GammaExposureProfileChart 
                                    zeroGammaLevelData={zeroGammaLevelData}
                                    spotPrice={spotPrice}
                                    currency={currency}
                                    exchange={exchange}
                                    width={width}
                                />
                                <AbsoluteGammaExposureChart 
                                    strikes={strikes}
                                    dfAgg={dfAgg}
                                    spotPrice={spotPrice}
                                    currency={currency}
                                    exchange={exchange}
                                    width={width}
                                />
                                <AbsoluteGammaCallsPutsChart 
                                    strikes={strikes}
                                    dfAgg={dfAgg}
                                    spotPrice={spotPrice}
                                    currency={currency}
                                    exchange={exchange}
                                    width={width}
                                />
                            </div>
                            <div className='flex'>
                                <GammaTable data={filterData} loading={loading} spotPrice={spotPrice} currency={currency} width={width}/>
                            </div>
                        
                        </>
                    ): null }
                    </>
                ) : (
                    <div className='w-full my-2 px-2'>
                        <div className='flex flex-wrap bg-white dark:bg-black w-full h-screen items-center justify-center rounded-lg shadow-sm px-4 py-4'>
                            <div className="py-8 px-4 mx-auto max-w-screen-md text-center items-center justify-center lg:py-16 lg:px-12">
                                <Image className='w-24 h-24 mx-auto ' src={ribbonImg} alt="ribbon_logo"></Image>
                                <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 lg:mb-6 md:text-5xl xl:text-6xl dark:text-white">No Selection Made Yet.</h1>
                                <p className="font-light text-gray-500 md:text-lg xl:text-xl dark:text-gray-400">Please Choose Your Preferred Currency & Exchange.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <>
                {/* <div className='w-full'>
                    {toggleDataset.map((item : any, index: number)=>{
                        const btcSpotPrice = Number(localStorage.getItem("btc"))
                        const ethSpotPrice =  Number(localStorage.getItem("eth"))
                        const spotPrice : number = item[0].currency === 'eth' ? ethSpotPrice : btcSpotPrice
                        const currency = item[0].currency.toUpperCase();
                        const exchange = item[0].exchange;

                        const {dfAgg, strikes} = calculateAbsoluteGammaExposure(item, spotPrice)
                        const zeroGammaLevel = calculateZeroGammaLevel(item,  spotPrice)
                        

                        return (

                            <div key={index} className='w-full'>
                                <div className='flex'>
                                    <GammaExposureProfileChart 
                                        zeroGammaLevelData={zeroGammaLevel}
                                        spotPrice={spotPrice}
                                        currency={currency}
                                        exchange={exchange}
                                        width={width}
                                    />
                                </div>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <AbsoluteGammaExposureChart 
                                        strikes={strikes}
                                        dfAgg={dfAgg}
                                        spotPrice={spotPrice}
                                        currency={currency}
                                        exchange={exchange}
                                        width={width}
                                    />
                                    <AbsoluteGammaCallsPutsChart 
                                        strikes={strikes}
                                        dfAgg={dfAgg}
                                        spotPrice={spotPrice}
                                        currency={currency}
                                        exchange={exchange}
                                        width={width}
                                    />
                                </div>
                         

                            </div>
                        )

                    })}
                </div> */}
            </>
        )}
    </div>
        
    </>
  )
}

export default GammaExposure

