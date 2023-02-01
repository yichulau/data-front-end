import React, { useEffect, useState } from 'react'
import StackedBarChart from './StackedBarChart'

const MiddleMedium = ({newFetchNotionalData, newFetchPremiumData} : any) => {

    const [dataSet, setDataSet] = useState(null);

    const volFilterChange = (value: number) => {
      setDataSet(value === 0 ? newFetchNotionalData : newFetchPremiumData);
    };

    useEffect(() => {
        setDataSet(dataSet);
      }, [dataSet]);
    
  return (
    <>
        <StackedBarChart data={dataSet || newFetchNotionalData} onChange={volFilterChange} />
    </>
  )
}

export default MiddleMedium