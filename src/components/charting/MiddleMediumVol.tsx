import React, { useEffect, useState } from 'react'
import LineChartVolume  from './LineChartVolume';
export const MiddleMediumVol = ({newFetchNotionalData, newFetchPremiumData, earliestTimestamp ,latestTimeStamp} : any) => {
    const [dataSet, setDataSet] = useState(null);

    const volFilterChange = (value: number) => {
      setDataSet(value === 0 ? newFetchNotionalData : newFetchPremiumData);
    };

    useEffect(() => {
        setDataSet(dataSet);
      }, [dataSet]);


  return (
    <>
        <LineChartVolume data={dataSet || newFetchNotionalData} earliestTimestamp={earliestTimestamp} latestTimeStamp={latestTimeStamp}  onChange={volFilterChange} />
    </>
  )
}
