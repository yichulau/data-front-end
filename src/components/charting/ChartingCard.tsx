import React, { useEffect, useState } from 'react'
import { contractTraded } from '../../utils/contract-traded-urls';
import { notionalVolume } from '../../utils/notional-volume-urls';
import BarChart from './BarChart';
import useFetchData from '../../hooks/useFetchData';
import useFetchNotional from '../../hooks/useFetchNotional';
import StackedBarChart from './StackedBarChart';
import { exchangeModel } from '../../models/exchangeModel';
import { coinCurrencyModel } from '../../models/coinCurrency';

const ChartingCard = ({option}: any) => {
  
    const urls = contractTraded.urls;
    const urlsNotional = notionalVolume.urls
    const fetchMultipleData = useFetchData(urls);
    const fetchNotionalData = useFetchNotional(urlsNotional);  

    const newFetchNotionalData = fetchNotionalData.map((item: any)=>{
      return {
        ...item,
        exchangeID: exchangeModel.getDataByExchange(item.exchangeID),
        coinCurrencyID: coinCurrencyModel.getDataByCurrency(item.coinCurrencyID)
      }
    })

    return (
    <>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className='w-full'>
            {option === 'StackedBarChart' ? (<StackedBarChart data={newFetchNotionalData}/> ) : null }
            {option === 'BarChart' ? (<BarChart data={fetchMultipleData}/>) : null }
          </div>

        </div>
    </>
    )
    }

export default ChartingCard