import React, { useEffect, useState } from 'react'
import { contractTraded } from '../../utils/contract-traded-urls';
import { notionalVolume } from '../../utils/notional-volume-urls';
import BarChart from './BarChart';
import useFetchData from '../../hooks/useFetchData';
import useFetchNotional from '../../hooks/useFetchNotional';

const ChartingCard = () => {
    
    const [contractTradedData, setContractTradedData] = useState([]);
    const urls = contractTraded.urls;
    const urlsNotional = notionalVolume.urls
    const fetchMultipleData = useFetchData(urls);
    const fetchNotionalData = useFetchNotional(urlsNotional);



    return (
    <>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Number Of Contract Traded</h5>
            </a>
            <div className='w-full'>
                <BarChart data={fetchNotionalData} />
            </div>
            
        </div>
    </>
    )
    }

export default ChartingCard