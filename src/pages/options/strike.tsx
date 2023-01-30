import React, { useEffect, useState } from 'react'
import Dropdown from '../../components/misc/Dropdown'
import StrikeChart from '../../components/charting/openInterest/StrikeChart';


const strike = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        async function fetchData() {
          const response = await fetch('https://fapi.coinglass.com/api/option/chart?type=Strike&ex=ALL&symbol=BTC&subtype=ALL');
          const json = await response.json();
          console.log(json)
          setData(json);
          setLoading(false);
        }
        fetchData();
      }, []);

    const option = [
        {id: 1, value: 'Deribit'},
        {id: 2, value: 'OKX'},
    ]
  return (
    <>
    <div className="container py-4 mx-auto">
        <div className="flex flex-wrap">
            <div className="p-6 md:w-1/2 flex flex-col items-start">
                <div className='bg-white w-full shadow-sm rounded-lg p-4'>
                    <h2 className="text-lg font-medium text-gray-900 mt-4 mb-4">BTC Options Open Interest By Strike</h2>
                    <div className='flex flex-row justify-between'>
                        <div></div>
                        <div className='flex'>
                            <div className='px-2 flex flex-col'>
                                <Dropdown 
                                    title={`Exchange`}
                                    options={option}
                                />
                            </div>
                            <div className='px-2'>
                                <Dropdown 
                                    title={`Symbol`}
                                    options={option}
                                />
                            </div>
                            <div className='px-2'>
                                <Dropdown 
                                    title={`Strike Price`}
                                    options={option}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <StrikeChart 
                            data={data}
                        />
                    </div>
                </div>
            </div>
            <div className="p-6 md:w-1/2 flex flex-col items-start">
                <div className='bg-white w-full shadow-sm rounded-lg p-4'>  
                    <h2 className="text-lg  font-medium text-gray-900 mt-4 mb-4">BTC Options Open Interest By Strike Volume</h2>
                </div>
            </div>
        </div>
    </div>  
    </>
  )
}

export default strike