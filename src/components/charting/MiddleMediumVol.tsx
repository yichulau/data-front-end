import React, { useEffect, useMemo, useState } from 'react'
import LineChartVolume  from './LineChartVolume';
export const MiddleMediumVol = ({newFetchNotionalData, newFetchPremiumData, earliestTimestamp ,latestTimeStamp} : any) => {
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
        <LineChartVolume data={memoizedDataSet} earliestTimestamp={earliestTimestamp} latestTimeStamp={latestTimeStamp}  onChange={volFilterChange} />
    </>
  )
}
