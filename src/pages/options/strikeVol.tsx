import React, { useEffect, useState } from 'react'
import Dropdown from '../../components/misc/Dropdown'
import useFetchSingleData from '../../hooks/useFetchSingleData';
import StrikeVolChart from '../../components/charting/openInterest/StrikeVolChart';

const strikeVol = () => {
  const [exchangeOption, setExchangeOption] = useState('ALL')
    const [ccyOption, setCcyOption] = useState('BTC')
    const [keysOptions, setKeysOptions] = useState('ALL')
    const url = `https://fapi.coinglass.com/api/option/chart?type=Strike&ex=${exchangeOption}&symbol=${ccyOption}&subtype=${keysOptions}`;
    const { data, error, loading} = useFetchSingleData(url)
    const responseData = data || [];
    let keysOption = [];
    
    if(data!== null){
        // @ts-ignore
        const keyList = responseData.data.keys;
        keysOption = keyList.map((str :any, index : any) => ({id: index + 1, value: str}));
        keysOption.unshift({id: 0, value: 'ALL'})
    }


    const handleOnChange = (value:any) =>{
        setExchangeOption(value)
    }
    const handleCcyChange = (value:any)=>{
        setCcyOption(value)
    }

    const handleKeyChange = (value :any) =>{
        setKeysOptions(value)
    }
    const option = [
        {id: 0, value: 'ALL'},
        {id: 1, value: 'Deribit'},
        {id: 2, value: 'OKX'},
        {id: 3, value: 'Bit.com'},
    ]
    const coinCurrencyOption = [
        {id: 1, value: 'BTC'},
        {id: 2, value: 'ETH'},
    ]
  return (
    <>
      <div className="container py-1 mx-auto">
          <div className="flex flex-wrap">
              <div className="px-6 py-2 md:w-full flex flex-col items-start">
                  <div className='bg-white w-full shadow-sm rounded-lg p-4 dark:bg-black'>
                      <h2 className="ml-1 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Options Open Interest Volume By Strike</h2>
                      <div className='flex flex-row justify-between'>
                        
                      <div className='flex'>
                            <div className='px-2 flex flex-col'>
                                <Dropdown 
                                    title={`Exchange`}
                                    options={option}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className='px-2'>
                                <Dropdown 
                                    title={`Symbol`}
                                    options={coinCurrencyOption}
                                    onChange={handleCcyChange}
                                />
                            </div>
                            <div className='px-2'>
                                <Dropdown 
                                    title={`Expiry`}
                                    options={keysOption}
                                    onChange={handleKeyChange}
                                />
                            </div>
                        </div>
                      </div>
                      <div className='md:w-full mt-2'>
                          {data !== null ? (
                              <StrikeVolChart 
                                  data={data}
                                  error={error}
                                  loading={loading}
                              />

                          ) : (
                              <div className="flex items-center justify-center min-h-[300px] p-5 bg-gray-100 w-full rounded-log dark:bg-black">

                                  <div className="flex space-x-2 animate-pulse">
                                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                  </div>
                          
                              </div>
                          )}

                      </div>
                  </div>
              </div>
          </div>
      </div>  
    </>
  )
}

export default strikeVol