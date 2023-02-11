import React, { useState, useEffect, useRef } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../utils/resize';
import PositionBuilderCharts from "../../components/charting/analysis/PositionBuilderCharts";
import PositionBuilderSearch from "../../components/charting/analysis/PositionBuilderSearch";
import useFetchSingleData from "../../hooks/useFetchSingleData";
import PositionTable from "../../components/charting/analysis/PositionTable";

interface PositionProps {
  stockPrice : number,
  strikePrice: number,
  optionType: string,
  premium: number,
  indexPrice: number,
  result: number
}
let positionArray :any=  [];


const PositionBuilder : React.FC<PositionProps> = () => {
  
  const dataSet: number[][] = []
  const [currency, setCurrency] = useState('BTC')
  const [exchange, setExchange] = useState('binance')
  const [currentPrice, setCurrentPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [finalData, setFinalData] = useState(dataSet)
  const [tempData, setTempData] = useState('');
  const [store, setStore] = useState({});


  const url = `https://data-ribbon-collector.com/api/v1.0/${currency}/${exchange}/instrument/`
  const { data } = useFetchSingleData(url)


  const min : number = -99;
  const max : number = 200;

  function storeToLocalStorage(value: any, triggerType :any){

    const storedPositions = localStorage.getItem("positions");
    const positionArray = storedPositions ? Object.values(JSON.parse(storedPositions)) : [];
    positionArray.push({...value, amount: Number(amount), exchange : exchange, position:  triggerType});
    let obj = positionArray.reduce(function(acc : any, cur : any, i : any) {
      acc[i] = cur;
      return acc;
    }, {});
    localStorage.setItem("positions", JSON.stringify(obj));
    const localData = (JSON.parse(localStorage.getItem('positions') || '{}'));
    setStore(localData)
  }

  function buyCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number ) {

    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;
    const profit = expiryPrice > strikePrice ? (diffStrikeExpiration  * amountBought)- (optionPrice * amountBought * currentPrice) : -( optionPrice * amountBought  * expiryPrice)

    return profit;
  }

  function sellCallOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number ){

    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice > strikePrice ? (optionPrice * amountBought * currentPrice) - (diffStrikeExpiration  * amountBought) : ( optionPrice * amountBought  * expiryPrice)


    return profit;
  }

  function buyPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number){
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? (optionPrice * amountBought * currentPrice) - (diffStrikeExpiration  * amountBought) : ( optionPrice * amountBought  * expiryPrice)


    return profit;
  }

  function sellPutOption(stockPricePercent : number, amount: number, currentPrice : number, strikePrice : number, optionPrice : number){
    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;

    const profit = expiryPrice < strikePrice ? (diffStrikeExpiration  * amountBought)- (optionPrice * amountBought * currentPrice) : ( optionPrice * amountBought  * expiryPrice)



    return profit;
  }

  function calculation(){
    dataSet.length = 0;
    const storeData = JSON.parse(localStorage.getItem('positions') || '{}')
    const storeDataArray : any = Object.values(storeData)
    let sums : any = {};
    let result = [];

    storeDataArray.map((item : any)=>{
      setCurrentPrice(Number(item.indexPrice))
      setAmount(item.amount)
      const instrumentString = item.instrumentName.split('-');
      const instrumentStrikePrice = Number(instrumentString[2])
      const instrumentType = instrumentString[3];
      const amount = item.amount;
      const currentPrice = Number(item.indexPrice);
      const optionPrice = Number(item.lastPrice);
      const strikePrice = instrumentStrikePrice;
      const type = instrumentType;
      
      if(item.position === 'Long' && type === 'C'){
        for (let i = min; i <= max; i++) {
          dataSet.push([i, buyCallOption(i,amount, currentPrice,strikePrice, optionPrice)]);
        }
      }
      if(item.position === 'Short' && type === 'C'){
        for (let i = min; i <= max; i++) {
          dataSet.push([i, sellCallOption(i,amount, currentPrice,strikePrice, optionPrice)]);
        }
      }
      if(item.position  === 'Long' && type === 'P'){
        for (let i = min; i <= max; i++) {
          dataSet.push([i, buyPutOption(i,amount, currentPrice,strikePrice, optionPrice)]);
        }
      }
      if(item.position  === 'Short' && type === 'P'){
        for (let i = min; i <= max; i++) {
          dataSet.push([i, sellPutOption(i,amount, currentPrice,strikePrice, optionPrice)]);
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

 

  const handleExchangeChange = (value : string) => {
    setExchange(value)
  }
  
  const handleSymbolChange = async (value:string) =>{
    const data  = await fetchInstrumentData(value)
    setTempData(data)
  }

  const handleAmountChange = (value: number) =>{
    setAmount(value)
  }

  const handleLongShort = (triggerType :string) =>{
    storeToLocalStorage(tempData, triggerType)
    calculation()

  }

  const handleCurrencyChange = (value: string ) =>{
    setCurrency(value)
  }

  const clearChart = ()=>{
    setFinalData([])
    setStore({})
    localStorage.removeItem('positions');
  }

  useEffect(()=>{
    setStore(JSON.parse(localStorage.getItem('positions') || '{}'))
    calculation();
  },[])
  

  
  return (
    <div className="container py-1 mx-auto">
      <div className="flex flex-wrap">
          <div className="px-2 py-2 w-full md:w-1/4 flex flex-col items-start">
              <div className='bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black'>
                  <div className='md:w-full mt-2'>
                      {data ?
                       (
                       <PositionBuilderSearch data={data}
                        handleExchangeChange={handleExchangeChange}
                        handleSymbolChange={handleSymbolChange}
                        handleAmountChange={handleAmountChange}
                        handleLongShort={handleLongShort}
                        handleCurrencyChange={handleCurrencyChange}
                        
                      />) : null }
                  </div>
              </div>
          </div>
          <div className="px-2 py-2 w-full md:w-3/4 flex flex-col items-start">
              <div className='bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black'>
                  <div className='md:w-full mt-2'>
                    {data ? (
                      <PositionBuilderCharts 
                        data={finalData} 
                        amount={amount} 
                        indexPrice={currentPrice} 
                        resetChart={clearChart}
                      />
                    ) : null }
                  </div>
              </div>
          </div>
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col items-start py-2 w-full">
          <div className="bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black">
              <PositionTable dataSet={store}/>
          </div>
        </div>
      </div>
    </div>  
  )
}

export default PositionBuilder