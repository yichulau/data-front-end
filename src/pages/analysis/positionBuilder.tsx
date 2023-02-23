import React, { useState, useEffect, useRef, useMemo } from "react";
import PositionBuilderCharts from "../../components/charting/analysis/PositionBuilderCharts";
import PositionBuilderSearch from "../../components/charting/analysis/PositionBuilderSearch";
import PositionBuilderExpandable from "../../components/charting/analysis/PositionBuilderExpandable";
import { v4 as uuidv4 } from 'uuid';
import { Toaster, ToastIcon, toast, resolveValue } from "react-hot-toast";
import getLatestDate from "../../utils/getLatestDate";
import { optionsCalculation } from "../../utils/optionsCalculation";
import { notificationDispatcher } from '../../utils/notificationDispatcher'
import Draggable from "react-draggable";
import moment from "moment";

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
  const [currency, setCurrency] = useState('')
  const [exchange, setExchange] = useState('')
  const [currentPrice, setCurrentPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [finalData, setFinalData] = useState(dataSet)
  const [tempData, setTempData] = useState('');
  const [store, setStore] = useState({});
  const [latestDate, setLatestDate] = useState('');
  const [error ,setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [apiData, setApiData] = useState([]);


  const min : number = -99;
  const max : number = 300;

  function storeToLocalStorage(value: any, triggerType :any){
    if(value.lastPrice === null ) {notificationDispatcher.notifyError(value); return};

    const storedPositions = localStorage.getItem("positions");
    const positionArray = storedPositions ? Object.values(JSON.parse(storedPositions)) : [];
    const lastAvgUSD = exchange === 'Binance' || exchange === 'Bybit' ? value.lastPrice : value.lastPrice* value.indexPrice;
    const lastPrice = exchange === 'Binance' || exchange === 'Bybit' ? value.lastPrice/value.indexPrice : value.lastPrice;
    positionArray.push({...value, amount: Number(amount), exchange : exchange, position:  triggerType, id: uuidv4(), lastPrice: lastPrice.toFixed(4), lastPriceUSD: lastAvgUSD.toFixed(4), symbol: value.instrumentName.substring(0,3), theta: value.theta !== null ? value.theta.toFixed(5) : 0, vega: value.vega !== null ? value.vega.toFixed(5) : 0, gamma: value.gamma !== null ? value.gamma.toFixed(5) : 0 });
    let obj = positionArray.reduce(function(acc : any, cur : any, i : any) {
      acc[i] = cur;
      return acc;
    }, {});
    localStorage.setItem("positions", JSON.stringify(obj));
    const localData = (JSON.parse(localStorage.getItem('positions') || '{}'));
    setStore(localData)
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
    if(storeDataArray.length > 0){
      const dataArray = checkedBoxData !== undefined ? checkedBoxData : storeDataArray;
      dataArray.map((item : any)=>{
        setCurrentPrice(Number(item.indexPrice))
        setAmount(item.amount)
        const instrumentType = item.callOrPut;
        const instrumentStrikePrice = Number(item.strike)
        const amount = item.amount;
        const currentPrice = Number(item.indexPrice);
        const optionPrice = Number(item.lastPrice);
        const thetaVal = Number(item.theta)
        const strikePrice = instrumentStrikePrice;
        const type = instrumentType;
        const currencyType = item.instrumentName.substring(0,3)
        const currencySpotValPrice : number = currencyType === 'BTC' ? btcSpotPrice : currencyType === 'ETH' ? ethSpotPrice : currencyType === 'SOL' ? solSpotPrice : 0;
        const expiryData = item.expiry
        const markIv = item.markIv
        const exchangeField = item.exchange
        const underlyingPrice = item.underlyingPrice
        const interval = currencyType === 'BTC' ?  500 : 50;
        const formattedNumbers : number[] = [];

        for (let i = 0; i <= Math.floor(currentPrice*8 / interval); i++) {
          formattedNumbers.push(parseFloat((i * interval).toFixed(6)));
        }

        if(item.position === 'Long' && type === 'C'){
          for (let i = 0; i <= formattedNumbers.length; i++) {
            dataSet.push([formattedNumbers[i], optionsCalculation.buyCallOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField), optionsCalculation.buyCallTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField,thetaVal, type, expiryData, markIv,underlyingPrice)]);
          }
        }
        if(item.position === 'Short' && type === 'C'){
          for (let i = 0; i <= formattedNumbers.length; i++) {
            dataSet.push([formattedNumbers[i], optionsCalculation.sellCallOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice, exchangeField), optionsCalculation.sellCallTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField,thetaVal, type, expiryData, markIv,underlyingPrice)]);
          }
        }
        if(item.position  === 'Long' && type === 'P'){
          for (let i = 0; i <= formattedNumbers.length; i++) {
            dataSet.push([formattedNumbers[i], optionsCalculation.buyPutOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice, exchangeField), optionsCalculation.buyPutTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField,thetaVal, type, expiryData, markIv,underlyingPrice)]);
          }
        }
        if(item.position  === 'Short' && type === 'P'){
          for (let i = 0; i <= formattedNumbers.length; i++) {
            dataSet.push([formattedNumbers[i], optionsCalculation.sellPutOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice, exchangeField),optionsCalculation.sellPutTimeDecayOption(formattedNumbers[i],amount, currentPrice,strikePrice, optionPrice , exchangeField,thetaVal, type, expiryData, markIv,underlyingPrice)]);
          }
        }
      })
      for (let i = 0; i < dataSet.length; i++) {
          if (!sums[dataSet[i][0]]) {
              sums[dataSet[i][0]] = [0, 0];
          }
          sums[dataSet[i][0]][0] += dataSet[i][1];
          sums[dataSet[i][0]][1] += dataSet[i][2];
      }
  
      for (let key in sums) {
        result.push([Number(key), sums[key][0], sums[key][1]]);
      }

      result.sort(function(a: any,b: any){
        return a[0] - b[0];
      })

    }

    console.log(result)
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
    setCurrency('')
    setTempData('')
    setAmount(0)
  }
  
  const handleSymbolChange = async (value:string) =>{
    const data  = await fetchInstrumentData(value)
    setTempData(data)
  }

  const handleAmountChange = (value: number) =>{
    setAmount(value)
  }

  const handleLongShort = (triggerType :string, currencies : string, symbols: string, exchanges : string, amounts: number) =>{
    const storeData = JSON.parse(localStorage.getItem('positions') || '{}')
    const storeDataArray : any = Object.values(storeData)
    const uniqueSymbolsString = storeDataArray.length !== 0 ?  [...new Set(storeDataArray.map((item : any) => item.symbol))].join(',') : "";
    
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

    storeToLocalStorage(tempData, triggerType)
    calculation()
    notificationDispatcher.notifySuccess(tempData)
    setError(false)
    setErrorMessage('')
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
    notificationDispatcher.notifyDelete(value)
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
      fetchData = fetchSingletData()
      fetchData.then((data: any) => {
        setApiData(data || [])
      }).catch((error: any) => {
        console.error(error);
      });
    } else {
      setApiData([]); 
    } 


  },[exchange,currency])



  return (
    
    <div className="container py-1 mx-auto">
      <div className="flex flex-wrap">
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
      </div>
    </div>  
  )
}

export default PositionBuilder