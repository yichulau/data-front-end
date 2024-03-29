import React, { useEffect, useState } from 'react'
import Dropdown from '../../components/misc/Dropdown'
import StrikeChart from '../../components/charting/openInterest/StrikeChart';
import useFetchSingleData from '../../hooks/useFetchSingleData';
import DropdownLeftOption from '../../components/misc/DropdownLeftOption';
import { activityCoinCurrencyOption, activityOption } from '../../utils/selector';
import { serverHost } from "../../utils/server-host";
import useSWR from 'swr';

const Strike = () => {
    const [exchangeOption, setExchangeOption] = useState('ALL')
    const [ccyOption, setCcyOption] = useState('BTC')
    const [keysOptions, setKeysOptions] = useState('ALL')
    let spotVal = `https://${serverHost.hostname}/api/v1.0/${ccyOption.toLowerCase()}/spotval`;
    let url = `https://${serverHost.hostname}/api/v1.0/${ccyOption.toLowerCase()}/${exchangeOption.toLowerCase()}/option-chart?expiry=${keysOptions === 'ALL' ? '' : keysOptions}`;
    const { data, error, loading} = useFetchSingleData(url)
    const spotData : any = useSWR(spotVal, async (url) => {
        const res = await fetch(url);
        return res.json();
    });
    const responseData : any = data || [];
    let keysOption = [];
    
    const price  = spotData? spotData.data?.spotValue : null;
    const dataList =  data !== null && price !== null ? formatData(responseData.strikeData, price) : [] ;

    if(data!== null){
        const keyList = responseData.expiryList;
        keysOption = keyList.map((str :any, index : any) => ({id: index + 1, value: str}));
        keysOption.unshift({id: 0, value: 'ALL'})
       
    }


    function formatData(data : any, spotVal : number) {
        const formattedData  : any  = {
          callOIList: [],
          putOIList: [],
          callVolList: [],
          putVolList: [],
          strikeList: []
        };
        
            data.forEach((item :any) => {
                formattedData.callOIList.push(item.callOITotal/spotVal);
                formattedData.putOIList.push(item.putOITotal/spotVal);
                formattedData.callVolList.push(item.callVolTotal/spotVal);
                formattedData.putVolList.push(item.putVolTotal/spotVal);
                formattedData.strikeList.push(item.strike);
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

  return (
    <>
    <div className="container py-1 mx-auto">
        <div className="flex flex-wrap">
            <div className="px-2 md:px-6 py-2 w-full h-full flex flex-col items-start">
                <div className='bg-white w-full shadow-sm rounded-lg p-4 dark:bg-black'>
                    <h2 className="ml-1 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Options Open Interest By Strike</h2>
                    <div className='flex flex-row justify-between'>
                       
                        <div className='flex'>
                            <div className='px-2 flex flex-col'>
                                <Dropdown 
                                    title={`Exchange`}
                                    options={activityOption}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className='px-2'>
                                <Dropdown 
                                    title={`Symbol`}
                                    options={activityCoinCurrencyOption}
                                    onChange={handleCcyChange}
                                />
                            </div>
                            <div className='px-2'>
                                <DropdownLeftOption 
                                    title={`Expiry`}
                                    options={keysOption}
                                    onChange={handleKeyChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='md:w-full mt-2'>
                        {data !== null ? (
                            <StrikeChart 
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
            {/* <div className="px-6 py-2  md:w-1/2 flex flex-col items-start">
                <div className='bg-white w-full shadow-sm rounded-lg p-4 dark:bg-black'>  
                    <h2 className="text-lg  font-medium text-gray-900 mt-4 mb-4 dark:text-white">BTC Options Open Interest By Strike Volume</h2>
                </div>
            </div> */}
        </div>
    </div>  
    </>
  )
}

export default Strike