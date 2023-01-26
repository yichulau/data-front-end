import React, { useEffect, useState } from 'react'

const useFetchData = (urls: string[]) => {

    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const responses = await Promise.all(urls.map(url => fetch(url)));
              const data : any = await Promise.all(responses.map(response => response.json()));
              const results = data.map((result : any, index: any)=>{
                const regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/contracts-traded/;
                // if(dataPoint === 'contracts-traded'){
                //     regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/contracts-traded/;
                // } else if (dataPoint === 'volume-notional'){
                //     regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/volume-notional/;
                // } else if (dataPoint === 'volume-premium'){
                //     regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/volume-premium/;
                // } else if (dataPoint === 'open-interest'){
                //     regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/open-interest/;
                // }
                const match = urls[index].match(regex) || '';
                return {
                    coinCurrency: match[1],
                    exchange: match[2],
                    count24h: result.count24H
                }
              })

              setData(data);
            } catch (error) {
              console.error(error);
            }
          }
          fetchData();
          
    }, [])
    return data;
}


export default useFetchData;