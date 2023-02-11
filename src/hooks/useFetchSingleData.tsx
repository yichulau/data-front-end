import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const useFetchSingleData = (url: string) => {
    // const { data, error, isLoading: loading } = useSWR(url, async (url) => {
    //     const res = await fetch(url);
    //     return res.json();
    // });
    // console.log(data)
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await fetch(url);
            const json = await res.json();
            setData(json);
            setLoading(false);
        } catch (err: any) {
            setError(err);
            setLoading(false);
        }
        };
        fetchData();
    }, [url]);

  return { data, error, loading   };
}


export default useFetchSingleData;