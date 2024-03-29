import React, { useEffect, useMemo, useState } from 'react'

const useFetchData = (urls: string[]) => {

    const [data, setData] = useState([]);
    const [loading ,setLoading] = useState(false)
    
    useMemo(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
              const responses = await Promise.all(urls.map(url => fetch(url)));
              const data : any = await Promise.all(responses.map(response => response.json()));
              const results = data.map((result : any, index: any)=>{
                const regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/contracts-traded/;

                const match = urls[index].match(regex) || '';
                return {
                    coinCurrency: match[1],
                    exchange: match[2],
                    count24h: result.count24H
                }
              })

              setData(results);
              setLoading(false)
            } catch (error) {
              console.error(error);
              setLoading(false)
            }
          }
          fetchData();
          
    }, [])
    return {data, loading};
}


export default useFetchData;