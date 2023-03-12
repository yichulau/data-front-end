import React, { useEffect, useState } from 'react'
import Dropdown from '../../components/misc/Dropdown'
import useFetchSingleData from '../../hooks/useFetchSingleData';
import useFetchData from '../../hooks/useFetchData';
import { contractTraded } from '../../utils/contract-traded-urls';
import ActivityPieChart from '../../components/activity/ActivityPieChart';
import ActivityTable from '../../components/activity/ActivityTable';
import usePolling from '../../hooks/usePolling';
import {
    useQuery,
    useMutation,
    useQueryClient,
  } from 'react-query'


const RecentTrade = () => {
    const queryClient = useQueryClient()
    const urlsContracts = contractTraded.urls;
    // const data = useFetchData(urlsContracts)
    // const summarizeData = summarizeCount24h(data)

    
    // function summarizeCount24h(data : any) {
    //     const result = [];
    //     const exchanges : any = new Set(data.map((d : any) => d.exchange));
    //     for (const exchange of exchanges) {
    //       const count24h = data
    //         .filter((d : any) => d.exchange === exchange)
    //         .reduce((sum : any, d: any) => sum + d.count24h, 0);
    //       result.push({ count24h, exchange });
    //     }
    //     return result;
    //   }  
    // async function fetchTableData(){
    //     const url = `https://data-ribbon-collector.com/api/v1.0/btc/okex/option-chart`;
    //     const response = await fetch(url)
    //     return response.json();
    // }   

    // const { isError, error, isLoading, data, isFetching} = useQuery(
    //     'recentTrade',
    //     fetchTableData,
    //     {
    //         refetchInterval: 10000, // poll every 5 seconds
    //     }
    // )

    // if (isFetching) {
    //     return <p>Loading...</p>;
    // }



  return (
    <>
        <div className="container py-1 mx-auto">
        <div className="flex flex-wrap">
            <div className="px-6 py-2 md:w-full flex flex-col items-start">
                <div className='bg-white w-full shadow-sm rounded-lg p-4 dark:bg-black'>
       
                    {/* <div className='md:w-full mt-2'>
                        {data !== null ? (
                            <>
                                <ActivityPieChart 
                                    data={summarizeData}
                                 
                                />
                            </>
        
                        ) : (
                            <div className="flex items-center justify-center min-h-[300px] p-5 bg-gray-100 w-full rounded-log dark:bg-black">

                                <div className="flex space-x-2 animate-pulse">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                </div>
                        
                            </div>
                        )}

                    </div> */}
                </div>
                <ActivityTable />
            </div>
        </div>
    </div>  
    </>
  )
}

export default RecentTrade