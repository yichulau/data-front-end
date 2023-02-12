import React, { useEffect, useState } from 'react'
import Dropdown from '../../components/misc/Dropdown'
import useFetchSingleData from '../../hooks/useFetchSingleData';
import ExpiryVolChart from '../../components/charting/openInterest/ExpiryVolChart';


const ExpiryVol = () => {
    const [exchangeOption, setExchangeOption] = useState('ALL')
    const [ccyOption, setCcyOption] = useState('BTC')
    const [keysOptions, setKeysOptions] = useState('ALL')
    let spotVal = `https://api4.binance.com/api/v3/ticker/price?symbol=${ccyOption}USDT`;
    let url = `https://data-ribbon-collector.com/api/v1.0/${ccyOption.toLowerCase()}/${exchangeOption.toLowerCase()}/option-chart?strike=${keysOptions === 'ALL' ? '' : keysOptions}`;
    const { data, error, loading} = useFetchSingleData(url)
    const spotData : any = useFetchSingleData(spotVal)
    const responseData : any = data || [];
    let keysOption = [];
    
    
    const price  = spotData? spotData.data?.price : null;
    const dataList =  data !== null && price !== null ? formatData(responseData.expiryData, price) : [] ;

    if(data!== null){
        const keyList = responseData.strikeData.map((item : any) => item.strike);
        keysOption = keyList.map((str :any, index : any) => ({id: index + 1, value: str}));
        keysOption.unshift({id: 0, value: 'ALL'})
       
    }

    function formatData(data : any, spotVal : number) {
        const formattedData  : any  = {
          callOIList: [],
          putOIList: [],
          callVolList: [],
          putVolList: [],
          expiryList: []
        };
        
        data.forEach((item :any) => {
            formattedData.callOIList.push(item.callOITotal/spotVal);
            formattedData.putOIList.push(item.putOITotal/spotVal);
            formattedData.callVolList.push(item.callVolTotal/spotVal);
            formattedData.putVolList.push(item.putVolTotal/spotVal);
            formattedData.expiryList.push(item.expiry);
        });

        return formattedData;
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
        {id: 2, value: 'OKEX'},
        {id: 3, value: 'Bit.com'},
        {id: 4, value: 'Binance'},
        {id: 5, value: 'Bybit'}
    ]
    const coinCurrencyOption = [
        {id: 1, value: 'BTC'},
        {id: 2, value: 'ETH'},
        {id: 3, value: 'SOL'},
    ]
  return (
    <>
      <div className="container py-1 mx-auto">
          <div className="flex flex-wrap">
              <div className="px-6 py-2 md:w-full flex flex-col items-start">
                  <div className='bg-white w-full shadow-sm rounded-lg p-4 dark:bg-black'>
                      <h2 className="ml-1 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Options Open Interest Volume By Expiry</h2>
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
                                    title={`Strike Price`}
                                    options={keysOption}
                                    onChange={handleKeyChange}
                                />
                            </div>
                        </div>
                      </div>
                      <div className='md:w-full mt-2'>
                          {data !== null ? (
                              <ExpiryVolChart 
                                  data={dataList}
                                  error={error}
                                  loading={loading}
                                  ccyOption={ccyOption}
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

export default ExpiryVol