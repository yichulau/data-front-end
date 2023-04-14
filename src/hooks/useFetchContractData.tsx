import React, { useEffect, useState } from 'react'

const useFetchContractData = (urls: string[]) => {

    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<any>('');
    const [loading, setLoading] = useState<any>(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
              const responses = await Promise.all(urls.map(url => fetch(url)));
              const data : any = await Promise.all(responses.map(response => response.json()));

              const results = data.map((result : any, index: any)=>{
                const regex = /\/api\/v1\.0\/([a-zA-Z]+?)\/([a-zA-Z.]+?)\/contracts-traded/;
                const match = urls[index].match(regex) || '';
                const currency = match[1]
                const exchange = match[2]

                setLoading(false)
                return {
                    currency : currency,
                    exchange : exchange,
                    result24H : result.result24H
                }
              })
              const flattenResult : any = Array.prototype.concat.apply([], results);
              setData(flattenResult);
            } catch (error) {
                setLoading(false)
                setError(error);
            }
          }
          fetchData();
          
    }, [])
    return {data, error,loading};
}


export default useFetchContractData;