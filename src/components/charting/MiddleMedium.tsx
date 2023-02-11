import React, { useEffect, useMemo, useState } from 'react'
import StackedBarChart from './StackedBarChart'

const MiddleMedium = ({newFetchNotionalData, newFetchPremiumData} : any) => {

    const [dataSet, setDataSet] = useState(null);

    const volFilterChange = (value: number) => {
      setDataSet(value === 0 ? newFetchNotionalData : newFetchPremiumData);
    };

    const memoizedDataSet = useMemo(
      () => (dataSet === null ? newFetchNotionalData : dataSet),
      [dataSet, newFetchNotionalData, newFetchPremiumData]
    );
    
  return (
    <>
        <StackedBarChart data={memoizedDataSet} onChange={volFilterChange} />
    </>
  )
}

export default MiddleMedium