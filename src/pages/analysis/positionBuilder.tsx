import React, { useState, useEffect, useRef } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../utils/resize';
import PositionBuilderCharts from "../../components/charting/analysis/PositionBuilderCharts";
import PositionBuilderSearch from "../../components/charting/analysis/PositionBuilderSearch";
import useFetchSingleData from "../../hooks/useFetchSingleData";
import PositionTable from "../../components/charting/analysis/PositionTable";
import PositionBuilderExpandable from "../../components/charting/analysis/PositionBuilderExpandable";
import { v4 as uuidv4 } from 'uuid';
import { Toaster, ToastIcon, toast, resolveValue } from "react-hot-toast";
import getLatestDate from "../../utils/getLatestDate";
import { optionsCalculation } from "../../utils/optionsCalculation";
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
  const [apiData, setApiData] = useState([])


  // const url = exchange !== '' && currency !== '' && currency !== 'Currency' ? `https://data-ribbon-collector.com/api/v1.0/${currency}/${exchange}/instrument/` : ''
  // const { data } = useFetchSingleData(url)
  // const newData = data !== null ? data : []


  const min : number = -99;
  const max : number = 300;

  function storeToLocalStorage(value: any, triggerType :any){

    const storedPositions = localStorage.getItem("positions");
    const positionArray = storedPositions ? Object.values(JSON.parse(storedPositions)) : [];
    positionArray.push({...value, amount: Number(amount), exchange : exchange, position:  triggerType, id: uuidv4(), lastPriceUSD: value.lastPrice* value.indexPrice});
    let obj = positionArray.reduce(function(acc : any, cur : any, i : any) {
      acc[i] = cur;
      return acc;
    }, {});
    localStorage.setItem("positions", JSON.stringify(obj));
    const localData = (JSON.parse(localStorage.getItem('positions') || '{}'));
    setStore(localData)
  }

  function calculation(){
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
      storeDataArray.map((item : any)=>{
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

        if(item.position === 'Long' && type === 'C'){
          for (let i = min; i <= max; i++) {
            dataSet.push([(currencySpotValPrice + ((i/100)*currencySpotValPrice)), optionsCalculation.buyCallOption(i,amount, currentPrice,strikePrice, optionPrice , exchangeField,thetaVal, type, expiryData, markIv)]);
          }
        }
        if(item.position === 'Short' && type === 'C'){
          for (let i = min; i <= max; i++) {
            dataSet.push([(currencySpotValPrice + ((i/100)*currencySpotValPrice)), optionsCalculation.sellCallOption(i,amount, currentPrice,strikePrice, optionPrice, exchangeField,thetaVal)]);
          }
        }
        if(item.position  === 'Long' && type === 'P'){
          for (let i = min; i <= max; i++) {
            dataSet.push([(currencySpotValPrice + ((i/100)*currencySpotValPrice)), optionsCalculation.buyPutOption(i,amount, currentPrice,strikePrice, optionPrice, exchangeField,thetaVal)]);
          }
        }
        if(item.position  === 'Short' && type === 'P'){
          for (let i = min; i <= max; i++) {
            dataSet.push([(currencySpotValPrice + ((i/100)*currencySpotValPrice)), optionsCalculation.sellPutOption(i,amount, currentPrice,strikePrice, optionPrice, exchangeField,thetaVal)]);
          }
        }
      })
  
      for (let i = 0; i < dataSet.length; i++) {
          if (!sums[dataSet[i][0]]) {
              sums[dataSet[i][0]] = 0;
          }
          sums[dataSet[i][0]] += dataSet[i][1];
      }
  
      for (let key in sums) {
        result.push([Number(key), sums[key]]);
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

  const handleLongShort = (triggerType :string) =>{
    if(amount < 0){
      setError(true)
      setErrorMessage('Please Amount cannot be less 0!')
      
      return ;
    } 
    if(triggerType && currency && exchange && tempData){
      storeToLocalStorage(tempData, triggerType)
      calculation()
      notifySuccess(tempData)
      setError(false)
      setErrorMessage('')
    } else {
      setError(true)
      setErrorMessage('Please Select All fields Before Running Calculation')
    }

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

  const notifySuccess = (value: any) =>
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
  const notifyDelete = (value: any) =>
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
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
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
      fetchData = []
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
              <PositionBuilderExpandable dataSet={store} onDelete={handleDelete}/>
          </div>
        </div>
      </div>
    </div>  
  )
}

export default PositionBuilder