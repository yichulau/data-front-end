import React, { useEffect, useState } from 'react'
import { contractTraded } from '../../utils/contract-traded-urls';
import { notionalVolume } from '../../utils/notional-volume-urls';
import BarChart from './BarChart';
import useFetchData from '../../hooks/useFetchData';
import useFetchNotional from '../../hooks/useFetchNotional';
import StackedBarChart from './StackedBarChart';
import { exchangeModel } from '../../models/exchangeModel';
import { coinCurrencyModel } from '../../models/coinCurrency';
import StackedLineChart from './StackedLineChart';
import { openInterest } from '../../utils/open-interest-urls';
import { premiumVolume } from '../../utils/premium-volume-urls';
import useFetchPremium from '../../hooks/useFetchPremium';
import LineChartVolume from './LineChartVolume';
import MiddleMedium from './MiddleMedium';

const ChartingCard = ({option}: any) => {

    const [dataSet, setData] = useState({});
  
    const urlsContracts = contractTraded.urls;
    const urlsNotional = notionalVolume.urls
    const urlsOpenInterest = openInterest.urls; 
    const urlsPremium = premiumVolume.urls

    // const fetchMultipleData = useFetchData(urlsContracts, 'contracts-traded');
    const fetchNotionalData = useFetchNotional(urlsNotional);  
    const fetchPremiumData = useFetchPremium(urlsPremium);

    const aggregrateNotionalData = [];
    const map = new Map();

    const newFetchNotionalData = fetchNotionalData.map((item: any)=>{
      return {
        ...item,
        exchangeID: exchangeModel.getDataByExchange(item.exchangeID),
        coinCurrencyID: coinCurrencyModel.getDataByCurrency(item.coinCurrencyID)
      }
    })
    const newFetchPremiumData = fetchPremiumData.map((item: any)=>{
      return {
        ...item,
        exchangeID: exchangeModel.getDataByExchange(item.exchangeID),
        coinCurrencyID: coinCurrencyModel.getDataByCurrency(item.coinCurrencyID)
      }
    })

    const fetchInterestData = useFetchNotional(urlsOpenInterest).map((item: any) => {
      return {
        ...item, 
        exchangeID: exchangeModel.getDataByExchange(item.exchangeID), 
        coinCurrencyID: coinCurrencyModel.getDataByCurrency(item.coinCurrencyID)
      }
    })

    
    for (const item of newFetchNotionalData) {
      const key = item.ts + item.coinCurrencyID;
      if (!map.has(key)) {
        map.set(key, { ts: item.ts, value: 0, coinCurrencyID: item.coinCurrencyID });
        aggregrateNotionalData.push(map.get(key));
      }
      map.get(key).value += parseFloat(item.value);
    }
    const earliestTimestamp = Math.min(...aggregrateNotionalData.map(item => item.ts));



    return (
    <>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className='w-full'>
            {option === 'StackedBarChart' ? (<MiddleMedium newFetchNotionalData={newFetchNotionalData} newFetchPremiumData={newFetchPremiumData} /> ) : null }
            {/* {option === 'StackedBarChart' ? (<StackedBarChart data={newFetchNotionalData} onChange={volFilterChange} /> ) : null } */}
            {/* {option === 'BarChart' ? (<BarChart data={useFetchData(urlsContracts)} />) : null } */}
            {option === "StackedLineChart" ? (<StackedLineChart data={fetchInterestData}  />) : null }
            {option === "LineChartVolume" ? (<LineChartVolume data={aggregrateNotionalData} earliestTimestamp={earliestTimestamp} />) : null }
          </div>
        </div>
    </>
    )
  }

export default ChartingCard