import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';

const StrikeChart = ({data} : any) => {
    const chartRef = useRef<any>(null);
    const responseData = data.data.data;

    console.log(responseData)
    useEffect(() => {
        if (responseData.length > 0) {
          const myChart = echarts.init(chartRef.current);
          myChart.setOption({
            xAxis: {
              type: 'Strike',
              data: responseData.keyList
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: responseData.callOIList,
              type: 'line'
            }]
          });
        }
      }, [data]);
  return (
    <>
        <div>
            <div ref={chartRef} id="open-interest-chart"></div>
        </div>
    </>
  )
}

export default StrikeChart

