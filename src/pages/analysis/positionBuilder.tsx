import React, { useState, useEffect, useRef } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../utils/resize';
import PositionBuilderCharts from "../../components/charting/analysis/PositionBuilderCharts";
import PositionBuilderSearch from "../../components/charting/analysis/PositionBuilderSearch";
import useFetchSingleData from "../../hooks/useFetchSingleData";

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
  const [currency, setCurrency] = useState('BTC')
  const [category, setCategory] = useState('option')
  const [active, setActive] = useState('true')
  const [currentPrice, setCurrentPrice] = useState(0)
  const [strikePrice, setStrikePrice] = useState(0)
  const [type, setType] = useState('');
  const [amount, setAmount] = useState(0)
  const [finalData, setFinalData] = useState(dataSet)
  const [optionPrice, setOptionPrice] = useState(0);
  const [tempData, setTempData] = useState('');
  let array :any= [];

  const bitComUrl = `https://api.bit.com/v1/instruments?currency=${currency}&category=${category}&active=${active}`;

  const { data } = useFetchSingleData(bitComUrl)


  const min : number = -99;
  const max : number = 200;

  function storeToLocalStorage(value: any){

    array.push(value)
    let obj = array.reduce(function(acc : any, cur : any, i : any) {
      acc[i] = cur;
      return acc;
    }, {});
    localStorage.setItem("positions", JSON.stringify(obj))
  }

  function buyCallOption(stockPricePercent : number) {

    const amountBought = Number(amount)
    const expiryPrice = currentPrice + (currentPrice * (stockPricePercent / 100));
    const diffStrikeExpiration = expiryPrice - strikePrice;
    const profit = expiryPrice > strikePrice ? (diffStrikeExpiration  * amountBought)- (optionPrice * amountBought * currentPrice) : ( optionPrice * amountBought  * expiryPrice)


    return profit;
  }

  function sellCallOption(stockPricePercent : number){
    const stockPrice = currentPrice + (currentPrice * (stockPricePercent / 100));

    const profit = ((stockPrice - strikePrice ) / stockPrice)
    const total = profit * amount

    return total;
  }

  function buyPutOption(stockPricePercent : number){
    const stockPrice = currentPrice + (currentPrice * (stockPricePercent / 100));

    const profit = ((strikePrice - stockPrice) / stockPrice) - optionPrice
    const total = profit * amount

    return total;
  }

  function sellPutOption(stockPricePercent : number){
    const stockPrice = currentPrice + (currentPrice * (stockPricePercent / 100));

    const profit = optionPrice - ((strikePrice - stockPrice) / stockPrice)
    const total = profit * amount 

    return total;
  }

  function calculation(triggerType : any){
    dataSet.length = 0;
    if(triggerType === 'Long' && type === 'C'){
      for (let i = min; i <= max; i++) {
        dataSet.push([i, buyCallOption(i)]);
      }
    }
    if(triggerType === 'Short' && type === 'C'){
      for (let i = min; i <= max; i++) {
        dataSet.push([i, sellCallOption(i)]);
      }
    }
    if(triggerType === 'Long' && type === 'P'){
      for (let i = min; i <= max; i++) {
        dataSet.push([i, buyPutOption(i)]);
      }
    }
    if(triggerType === 'Short' && type === 'P'){
      for (let i = min; i <= max; i++) {
        dataSet.push([i, sellPutOption(i)]);
      }
    }
  
    setFinalData(dataSet)
    storeToLocalStorage(tempData)
  }

  async function fetchInstrumentData(instrument : any) {
    const url = `https://api.bit.com/v1/tickers?instrument_id=${instrument}`
    const response = await fetch(url)
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const data = response.json()
    return data
  }

 

  const handleExchangeChange = (value : string) => {
    console.log(value)
  }
  
  const handleSymbolChange = async (value:string) =>{
    const { data } = await fetchInstrumentData(value)

    const instrumentString = value.split('-');
    const instrumentStrikePrice = Number(instrumentString[2])
    const instrumentType = instrumentString[3];

    setTempData(data)
    setCurrentPrice(Number(data.index_price))
    setOptionPrice(Number(data.last_price))
    setStrikePrice(instrumentStrikePrice)
    setType(instrumentType)

  }

  const handleAmountChange = (value: number) =>{
    setAmount(value)
  }

  const handleLongShort = (value :string) =>{
    calculation(value)
  }

  const handleCurrencyChange = (value: string ) =>{
    setCurrency(value)
  }



  return (
    <div className="container py-1 mx-auto">
      <div className="flex flex-wrap">
          <div className="px-6 py-2 md:w-1/4 flex flex-col items-start">
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
          <div className="px-6 py-2 md:w-3/4 flex flex-col items-start">
              <div className='bg-white w-full h-full shadow-sm rounded-lg p-4 dark:bg-black'>
                  <div className='md:w-full mt-2'>
                    {data ? (<PositionBuilderCharts data={finalData} />) : null }
                  </div>
              </div>
          </div>
      </div>
    </div>  
  )
}

export default PositionBuilder