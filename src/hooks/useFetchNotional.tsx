import React, { useEffect, useState } from 'react'
import { exchangeModel } from '../models/exchangeModel';
import { coinCurrencyModel } from '../models/coinCurrency';
const useFetchNotional = (urls: string[]) => {

    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const responses = await Promise.all(urls.map(url => fetch(url)));
              const data : any = await Promise.all(responses.map(response => response.json()));
              const results = data.map((result : any, index: any)=>{
                const regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/volume-notional/;

                const match = urls[index].match(regex) || '';
                const results = result.result;

                return results
              })
              const flattenResult : any = Array.prototype.concat.apply([], results);
              setData(flattenResult);
            } catch (error) {
              console.error(error);
            }
          }
          fetchData();
          
    }, [])
    return data;
}


export default useFetchNotional;