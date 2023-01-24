import React, { useEffect, useState } from 'react'
import { contractTraded } from '../../utils/contract-traded-urls';
import BarChart from './BarChart';

const ChartingCard = () => {
    
    const [contractTradedData, setContractTradedData] = useState([]);
    const urls = contractTraded.urls;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const responses = await Promise.all(urls.map(url => fetch(url)));
              const data : any = await Promise.all(responses.map(response => response.json()));
              console.log(data)
              setContractTradedData(data);
            } catch (error) {
              console.error(error);
            }
          }
          fetchData();
     
    }, [])


    return (
    <>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Number Of Contract Traded</h5>
            </a>
            {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}
            <div className='w-full h-[250px]'>
                <BarChart data={contractTradedData}/>
            </div>
            
        </div>
    </>
    )
    }

export default ChartingCard