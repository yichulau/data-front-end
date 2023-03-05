import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import PositionBuilderCharts from "../../components/charting/analysis/PositionBuilderCharts";
import PositionBuilderSearch from "../../components/charting/analysis/PositionBuilderSearch";
import PositionBuilderExpandable from "../../components/charting/analysis/PositionBuilderExpandable";
import { v4 as uuidv4 } from 'uuid';
import { Toaster, ToastIcon, toast, resolveValue } from "react-hot-toast";
import getLatestDate from "../../utils/getLatestDate";
import { optionsCalculation } from "../../utils/optionsCalculation";
import {daysTillExpiry, getCurrentDate} from '../../utils/date';
// import { notificationDispatcher } from '../../utils/notificationDispatcher'
import moment from "moment";
import BlackScholes from "../../utils/blackScholes";
import { FaPlus, FaChartPie, FaTable } from 'react-icons/fa'
import {MdOutlineDragIndicator} from 'react-icons/md';
import { Responsive, WidthProvider } from 'react-grid-layout';


import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
interface PositionProps {
  stockPrice : number,
  strikePrice: number,
  optionType: string,
  premium: number,
  indexPrice: number,
  result: number
}

const PositionBuilder : React.FC<PositionProps> = () => {
  
  const dataSet: number[][] = []
  const [width, setWidth] = useState<number>(0);
  const [currency, setCurrency] = useState('')
  const [exchange, setExchange] = useState('')
  const [currentPrice, setCurrentPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [finalData, setFinalData] = useState(dataSet)
  const [tempData, setTempData] = useState<any>('');
  const [store, setStore] = useState({});
  const [latestDate, setLatestDate] = useState('');
  const [error ,setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [apiData, setApiData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [instrumentLoading, setInstrumentLoading] = useState(false)
  const [symbolLoading, setSymbolLoading] = useState(false);
  const windowWidth = useRef<number>(0);
  const [layout, setLayout] = useState<any>([
    { i: 'positionCreator', x: 0, y: 0, w: 3, h: 11, minW: 2, maxW: 12 , minH: 9, },
    { i: 'chartContainer', x: 5, y: 0, w: 9, h: 11, minW: 9, maxW: 12 , minH: 11, maxH: 13 },
    { i: 'positionsTable', x: 0, y: 1, w: 12, h: 8 , minW: 6, maxW: 12 , minH: 6, maxH: 13 },
  ]);

  function storeToLocalStorage(value: any, triggerType :any){
    const storedPositions = localStorage.getItem("positions");
    const positionArray = storedPositions ? Object.values(JSON.parse(storedPositions)) : [];
    const lastAvgUSD = exchange === 'Binance' || exchange === 'Bybit' ? value.lastPrice : value.lastPrice* value.indexPrice;
    const lastPrice = exchange === 'Binance' || exchange === 'Bybit' ? value.lastPrice/value.indexPrice : value.lastPrice;
    const markPriced = exchange === 'Binance' || exchange === 'Bybit' ? value.markPrice/value.indexPrice : value.markPrice;
    positionArray.push({...value, amount: Number(amount), exchange : exchange, position:  triggerType, id: uuidv4(), markPrice: markPriced !== null ?  markPriced.toFixed(4) : null , lastPrice: lastPrice !== null ? lastPrice.toFixed(4) : null, lastPriceUSD: lastAvgUSD !== null ? lastAvgUSD.toFixed(4) : null, symbol: value.instrumentName.substring(0,3), theta: value.theta !== null ? value.theta.toFixed(5) : 0, vega: value.vega !== null ? value.vega.toFixed(5) : 0, gamma: value.gamma !== null ? value.gamma.toFixed(5) : 0 });
    let obj = positionArray.reduce(function(acc : any, cur : any, i : any) {
      acc[i] = cur;
      return acc;
    }, {});
    localStorage.setItem("positions", JSON.stringify(obj));
    const localData = (JSON.parse(localStorage.getItem('positions') || '{}'));
    setStore(localData)
    calculation()
  }

  function calculation(checkedBoxData? : any){ // checkedBoxData is optional passed
    dataSet.length = 0;
    const storeData = JSON.parse(localStorage.getItem('positions') || '{}')
    const storeDataArray : any = Object.values(storeData)
    const expiryData = storeDataArray.map((item : any) => {return item.expiry})
    const latestDate : any = expiryData.length > 0 ? getLatestDate(expiryData) : new Date()
    const btcSpotPrice = Number(localStorage.getItem("btc"))
    const ethSpotPrice = Number(localStorage.getItem("eth"))
    const solSpotPrice = Number(localStorage.getItem("sol"))

    setLatestDate(latestDate)

    let sums : any = {};
    let result: any= [];
    let newResultArr : any = [];
    if(storeDataArray.length > 0){
      const dataArray = checkedBoxData ?? storeDataArray;
      dataArray.map((item : any)=>{
        setCurrentPrice(Number(item.indexPrice))
        setAmount(item.amount)
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
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));


        const currentPrice = Number(item.indexPrice);
        const optionLastPrice = Number(item.lastPrice);
        const optionPrice = Number(item.markPrice);
        const thetaVal = Number(item.theta);
        const gammaVal = Number(item.gamma);
        const vegaVal = Number(item.vega);
        const deltaVal = Number(item.delta);
        const rhoVal = Number(item.rho);
        // const currencySpotValPrice : number = currencyType === 'BTC' ? btcSpotPrice : currencyType === 'ETH' ? ethSpotPrice : currencyType === 'SOL' ? solSpotPrice : 0;
        const markIv = item.markIv
        const exchangeField = item.exchange
        const interval = currencyType === 'BTC' ?  500 : 100;
        const formattedNumbers : number[] = [];




        // const buyOrSellVal = item.position === 'Long' ? 1 : -1
        // let optionPriceObject = {
        //   stockPrice: underlyingPrice,
        //   interestRate: 0.02,
        //   buyOrSell: item.position === 'Long' ? "buy" : "sell",
        //   quantity: amount,
        //   type: type === 'C' ? "call" : "put",
        //   strike: strikePrice,
        //   daysToExpiry: diffDays >= 0 ? diffDays : 0,
        //   volatility: 0.64,
        //   credit: 0
        // }

        // let blackScholes = new BlackScholes(optionPriceObject)
        // let price = blackScholes.price()
        // optionPriceObject.credit = buyOrSellVal * price * parseInt(amount)
        // newResultArr.push(optionPriceObject)


        // for (let i = 0; i <= Math.floor(currentPrice*8 / interval); i++) {
        //   formattedNumbers.push(parseFloat((i * interval).toFixed(6)));
        // }

        // if(item.position === 'Long' && type === 'C'){
        //   for (let i = 0; i <= formattedNumbers.length - 1; i++) {
        //     dataSet.push([
        //       formattedNumbers[i], 
        //       optionsCalculation.buyCallOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField), 
        //       optionsCalculation.buyCallTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField, type, expiryData, markIv,underlyingPrice, thetaVal,gammaVal, vegaVal, deltaVal, rhoVal, optionLastPrice, item.position,  item.high24h , item.low24h,daysDiff, optionType, mul  )
        //     ]);
        //   }
        // }
        // if(item.position === 'Short' && type === 'C'){
        //   for (let i = 0; i <= formattedNumbers.length; i++) {
        //     dataSet.push([formattedNumbers[i], 
        //       optionsCalculation.sellCallOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice, exchangeField), 
        //       optionsCalculation.sellCallTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField, type, expiryData, markIv,underlyingPrice, thetaVal,gammaVal, vegaVal, deltaVal, rhoVal, optionLastPrice, item.position,  item.high24h , item.low24h,daysDiff, optionType, mul )]);
        //   }
        // }
        // if(item.position  === 'Long' && type === 'P'){
        //   for (let i = 0; i <= formattedNumbers.length; i++) {
        //     dataSet.push([formattedNumbers[i], 
        //       optionsCalculation.buyPutOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice, exchangeField),
        //        optionsCalculation.buyPutTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField, type, expiryData, markIv,underlyingPrice, thetaVal,gammaVal, vegaVal, deltaVal, rhoVal, optionLastPrice, item.position,  item.high24h , item.low24h ,daysDiff, optionType, mul)]);
        //   }
        // }
        // if(item.position  === 'Short' && type === 'P'){
        //   for (let i = 0; i <= formattedNumbers.length; i++) {
        //     dataSet.push([formattedNumbers[i], 
        //       optionsCalculation.sellPutOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice, exchangeField),
        //       optionsCalculation.sellPutTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField, type, expiryData, markIv,underlyingPrice, thetaVal,gammaVal, vegaVal, deltaVal, rhoVal, optionLastPrice, item.position,  item.high24h , item.low24h,daysDiff, optionType, mul )]);
        //   }
        // }
      })

      // const data : any = newResultArr.length > 0 ? optionsCalculation.getOptionsGraph(newResultArr) : []
      // const output = newResultArr.length > 0 ? data.optionsData.map((option : any) => {
      //   const x = option.x;
      //   const optionsDataY = option.y;
      //   const optionsDataAtExpiryY = data.optionsDataAtExpiry.find((optionAtExpiry : any) => optionAtExpiry.x === x)?.y;
      //   return [x,  optionsDataAtExpiryY, optionsDataY,];
      // }).filter((option : any) => option[2] !== undefined) : [];
      // result = output
     
      // for (let i = 0; i < dataSet.length; i++) {
      //     if (!sums[dataSet[i][0]]) {
      //         sums[dataSet[i][0]] = [0, 0];
      //     }
      //     sums[dataSet[i][0]][0] += dataSet[i][1];
      //     sums[dataSet[i][0]][1] += dataSet[i][2];
      // }
  
      // for (let key in sums) {
      //   result.push([Number(key), sums[key][0], sums[key][1]]);
      // }

      // result.sort(function(a: any,b: any){
      //   return a[0] - b[0];
      // })

      result = dataArray

    }


    setFinalData(result)    
  }

  async function fetchInstrumentData(instrument : any) {
    const url = `https://data-ribbon-collector.com/api/v1.0/${currency}/${exchange}/instrument/${instrument}`
    const response = await fetch(url)
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const data = response.json()
    return data
  }

  const handleExchangeChange = (value: string) => {
    setExchange(value)  
    // setCurrency('')
    // setTempData('')
    // setAmount(0)
  }
  
  const handleSymbolChange = async (value:string) =>{
    setInstrumentLoading(true)
    const data  = await fetchInstrumentData(value)
    setInstrumentLoading(false)
    setTempData(data)
  }

  const handleAmountChange = (value: number) =>{
    setAmount(value)
  }

  const handleLongShort = (triggerType :string, currencies : string, symbols: string, exchanges : string, amounts: number) =>{
    const storeData = JSON.parse(localStorage.getItem('positions') || '{}')
    const storeDataArray : any = Object.values(storeData)
    const uniqueSymbolsString = storeDataArray.length !== 0 ?  [...new Set(storeDataArray.map((item : any) => item.symbol))].join(',') : "";
    console.log(currencies ,exchanges, symbols)
    if(currencies === null || exchanges === null  || symbols === null){
      setError(true)
      setErrorMessage('Please Select All fields Before Running Calculation')
      return ;
    }
    if(currencies !== uniqueSymbolsString && storeDataArray.length > 0){
      setError(true)
      setErrorMessage(`Please Do not Select Other Currency other than ${uniqueSymbolsString} into the Calculation`)
      return ;
    }
    if(amounts <= 0){
      setError(true)
      setErrorMessage('Please Amount cannot be 0 or less 0!')
      return ;
    } 

    if(tempData.markPrice === null ){ notifyError(tempData); return};
    storeToLocalStorage(tempData, triggerType)
    calculation()
    notifySuccess(tempData)
    setError(false)
    setErrorMessage('')
    if(tempData.lastPrice === null ){ notifyWarning(tempData); return};
  }

  const handleCurrencyChange = (value: string ) =>{
    setCurrency(value)
  }

  const clearChart = ()=>{
    setFinalData([])
    setStore({})
    localStorage.removeItem('positions');
  }

  const handleDelete = (value : any) =>{
    const storeData = JSON.parse(localStorage.getItem('positions') || '{}')
    const storeDataArray : any = Object.values(storeData)
    const idToDelete = value.id;

    storeDataArray.map((arr : any, index : any) =>{
      if(arr.id === idToDelete){
        storeDataArray.splice(index,1);
        return storeDataArray
      }
    })
    const obj = Object.assign({}, storeDataArray)
    localStorage.setItem("positions", JSON.stringify(obj));
    const localData = (JSON.parse(localStorage.getItem('positions') || '{}'));
    setStore(localData)
    calculation()
    notifyDelete(value)
  }

  
  const handleCheckBoxChanges = (value : any) => {
    const checkedBoxData = value.selectedFlatRowsOriginal
    calculation(checkedBoxData)
  }

  async function fetchSpotData(currencies : any) {
    const url = `https://api4.binance.com/api/v3/ticker/price?symbol=${currencies}USDT`
    const response = await fetch(url)
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const data = response.json()
    return data
  }

  
  function notifySuccess(value: any){
    toast.custom(
    (t) => (
        <div
        className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-black  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5 inline-flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200 ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                Position Added!
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                Instrument {value.instrumentName} has been added!
                </p>
            </div>
            </div>
        </div>
    </div>
    ),
    { id: "unique-notification", position: "top-center" }
    );
  }


  function notifyDelete(value: any){
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-black  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200 ">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Position Deleted!
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                  Instrument {value.instrumentName} has been deleted!
                </p>
              </div>
            </div>
          </div>
      </div>
      ),
    { id: "unique-notification", position: "top-center" }
  );
  }

  function notifyError (value: any){
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-black  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200 ">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Error!!
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                  Instrument {value.instrumentName} does not have a Mark Price!!
                </p>
              </div>
            </div>
          </div>
      </div>
      ),
    { id: "unique-notification", position: "top-center" }
  );

  }

  function notifyWarning (value: any){
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-black  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                
            </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Warning!
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                  Instrument {value.instrumentName} last price is not found! No recent trades for this instrument 
                </p>
              </div>
            </div>
          </div>
      </div>
      ),
    { id: "unique-notification", position: "top-center" }
  );

  }

  function handleTabClick(index : any){
    setActiveTab(index);
  };




  useEffect(()=>{
    const fetchAllSpotData = async () =>{
      const {price: btcSpotVal }= await fetchSpotData('BTC');
      const {price: ethSpotVal } = await fetchSpotData('ETH');
      const {price: solSpotVal }= await fetchSpotData('SOL');

      localStorage.setItem("btc", btcSpotVal)
      localStorage.setItem("eth", ethSpotVal)
      localStorage.setItem("sol", solSpotVal)
    }

    fetchAllSpotData()

  },[])
  

  useEffect(()=>{
    if (typeof window !== 'undefined') {
      windowWidth.current = window.innerWidth;
      setWidth(windowWidth.current);
    }
    setStore(JSON.parse(localStorage.getItem('positions') || '{}'))
    calculation();
  },[])

  useEffect(()=>{
    let fetchData : any = [];
    async function fetchSingletData() {
      const url = `https://data-ribbon-collector.com/api/v1.0/${currency}/${exchange}/instrument/`
      const response = await fetch(url)
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
  
      const data = response.json()
      return data
    }
    if(exchange !== '' && currency !== ''){
      setSymbolLoading(true)
      fetchData = fetchSingletData()
      fetchData.then((data: any) => {
        setApiData(data || [])
        setSymbolLoading(false)
      }).catch((error: any) => {
        console.error(error);
      });
    } else {
      setApiData([]); 
    } 


  },[exchange,currency])

  const tabItems = [
    {
      label: "Add Position",
      component: (
        <div className='md:w-full mt-2'>
          <Toaster />
          <PositionBuilderSearch data={apiData}
            handleExchangeChange={handleExchangeChange}
            handleSymbolChange={handleSymbolChange}
            handleAmountChange={handleAmountChange}
            handleLongShort={handleLongShort}
            handleCurrencyChange={handleCurrencyChange}
            exchange={exchange}
            error={error}
            errorMessage={errorMessage}
            instrumentLoading={instrumentLoading}
            symbolLoading={symbolLoading}
          />
        </div>
      ),
    },
    {
      label: "Charts",
      component: (
        <div className='md:w-full mt-2 '>
          {finalData ? (
            <PositionBuilderCharts 
              data={finalData} 
              amount={amount} 
              indexPrice={currentPrice} 
              resetChart={clearChart}
              latestDate={latestDate}
            />
          ) : (
            <PositionBuilderCharts 
              data={[]} 
              amount={amount} 
              indexPrice={currentPrice} 
              resetChart={clearChart}
              latestDate={latestDate}
            />
          ) }
        </div>
      ),
    },
    {
      label: "Table",
      component: (
        <div className="bg-white w-full shadow-sm rounded-lg py-2  dark:bg-black h-[650px] md:h-auto">
          <PositionBuilderExpandable dataSet={store} onDelete={handleDelete} handleCheckBoxChanges={handleCheckBoxChanges}/>
        </div>
      ),
    },
  ];


  const onPositionsTableDragStart = (layout: any, oldItem: any, newItem: any) => {
    const positionCreatorItem = layout.find((item: any) => item.i === 'positionCreator');
    if (newItem.y < positionCreatorItem.y + positionCreatorItem.h) {
      // Don't allow the positionsTable component to overlap with the positionCreator component
      newItem.y = positionCreatorItem.y + positionCreatorItem.h;
    }
    setLayout(layout.map((item: any) => item.i === newItem.i ? newItem : item));
  }


  
  return (
    <>
      {width > 764 ? (
         <>
          <div className="container py-1 mx-auto">
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout }}
              breakpoints={{ lg: 1200 }}
              cols={{ lg: 12 }}
              rowHeight={55}
              draggableHandle=".drag-handle"
              onLayoutChange={newLayout => setLayout(newLayout)}
              useCSSTransforms={false} 
            >
              <div key="positionCreator" className="grid-item">
                <div className=" bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black">
                      <div className='md:w-full mt-2'>
                        <div className="cursor-grab right-4 drag-handle absolute "><MdOutlineDragIndicator /></div>
                        <PositionBuilderSearch data={apiData}
                            handleExchangeChange={handleExchangeChange}
                            handleSymbolChange={handleSymbolChange}
                            handleAmountChange={handleAmountChange}
                            handleLongShort={handleLongShort}
                            handleCurrencyChange={handleCurrencyChange}
                            exchange={exchange}
                            error={error}
                            errorMessage={errorMessage}
                            instrumentLoading={instrumentLoading}
                            symbolLoading={symbolLoading}
                          />
                      </div>
                </div>
              </div>
              <div key="chartContainer" className="grid-item">
                <div className="bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black">
                  <div className='md:w-full mt-2'>
                  <div className="cursor-grab float-right drag-handle "><MdOutlineDragIndicator /></div>
                  <Toaster />
                    {finalData ? (
                      <PositionBuilderCharts 
                        data={finalData} 
                        amount={amount} 
                        indexPrice={currentPrice} 
                        resetChart={clearChart}
                        latestDate={latestDate}
                      />
                    ) : (
                      <PositionBuilderCharts 
                        data={[]} 
                        amount={amount} 
                        indexPrice={currentPrice} 
                        resetChart={clearChart}
                        latestDate={latestDate}
                      />
                    ) }
                  </div>
                </div>
              </div>
              <div key="positionsTable" className="grid-item">
                <div className="bg-white w-full h-full shadow-sm rounded-lg py-2  dark:bg-black">
                    <div className="cursor-grab float-right drag-handle pr-4 pt-4"><MdOutlineDragIndicator /></div>
                    <PositionBuilderExpandable dataSet={store} onDelete={handleDelete} handleCheckBoxChanges={handleCheckBoxChanges}/>
                </div>
              </div>
            </ResponsiveGridLayout>
              {/* <div className="flex flex-wrap">
                  <div className="px-2 py-2 w-full md:w-1/4 flex flex-col items-start">
                      <div className='bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black'>
                          <div className='md:w-full mt-2'>
                            <PositionBuilderSearch data={apiData}
                                handleExchangeChange={handleExchangeChange}
                                handleSymbolChange={handleSymbolChange}
                                handleAmountChange={handleAmountChange}
                                handleLongShort={handleLongShort}
                                handleCurrencyChange={handleCurrencyChange}
                                exchange={exchange}
                                error={error}
                                errorMessage={errorMessage}
                                instrumentLoading={instrumentLoading}
                              />
                          </div>
                      </div>
                  </div>
                  <div className="px-2 py-2 w-full md:w-3/4 flex flex-col items-start">
                      <div className='bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black'>
                          <div className='md:w-full mt-2'>
                          <Toaster />
                            {finalData ? (
                              <PositionBuilderCharts 
                                data={finalData} 
                                amount={amount} 
                                indexPrice={currentPrice} 
                                resetChart={clearChart}
                                latestDate={latestDate}
                              />
                            ) : (
                              <PositionBuilderCharts 
                                data={[]} 
                                amount={amount} 
                                indexPrice={currentPrice} 
                                resetChart={clearChart}
                                latestDate={latestDate}
                              />
                            ) }
                          </div>
                      </div>
                  </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex flex-col items-start py-2 px-2 w-full">
                  <div className="bg-white w-full h-full shadow-sm rounded-lg py-2  dark:bg-black">
                      <PositionBuilderExpandable dataSet={store} onDelete={handleDelete} handleCheckBoxChanges={handleCheckBoxChanges}/>
                  </div>
                </div>
              </div> */}
          </div> 
        </>
      ) : null}
      {width <= 764 ? (
        <>
          <div className="container py-1 mx-auto">
            <div className="flex flex-wrap">
              <div className="px-2 py-2 w-full flex flex-col items-start">
                <div className='bg-white w-full shadow-sm rounded-t-lg p-4 dark:bg-black'>
                  <div className='md:w-full mt-2'>
                    {tabItems[activeTab].component}
                  </div>
                </div>
              </div>
                <div className="overflow-hidden border border-gray-100 dark:border-black bg-gray-50 dark:bg-black p-1 w-full">
                  <ul className="flex items-center gap-2 text-sm font-medium">
                  {tabItems.map((item, index) => (
                      <li className="flex-1"  key={index} onClick={() => handleTabClick(index)}>
                        <div
                          className={`flex items-center justify-center gap-2 rounded-lg  px-3 py-2 cursor-pointer  ${activeTab === index ? "bg-white dark:bg-gray-800 text-gra dark:text-white relative shadow" : ""}`}
                        >
                          {index === 0 && <FaPlus />}
                          {index === 1 && <FaChartPie />}
                          {index === 2 && <FaTable />}
                          {item.label}</div>
                      </li>
                  ))}
                  </ul>
                </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  
  )
}

export default PositionBuilder


