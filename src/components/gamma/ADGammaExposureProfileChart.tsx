import React, { useContext, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts';
import MyThemeContext from '../../store/myThemeContext';
import moment from 'moment';
import _ from 'lodash';

const ADGammaExposureProfileChart = ({ data, symbol, expiration }: any) => {
    const { isDarkTheme }= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    const resizeObserver : any= useRef(null);
    const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

    const groupedData = data.reduce((acc:any, item:any) => {
        if (!acc[item.spot]) {
          acc[item.spot] = 0;
        }
        acc[item.spot] += item.usd_gamma;
        return acc;
      }, {});
      
    const summedData = Object.entries(groupedData).map(([spot, usd_gamma]) => ({
        spot: Number(spot),
        usd_gamma,
    }));

    // console.log(summedData)

    const getSeriesData = () => {
        return summedData.map((item : any) => ({
          value: item.usd_gamma,
          itemStyle: {
            color: item.usd_gamma > 0 ? 'green' : 'red',
          },
        }));
    };

    useEffect(() => {
        if (!chartRef.current) {
          return;
        }
        if (!chartInstance) {
          setChartInstance(isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current));
        }
        const option = {
            title: {
              text: expiration
                ? `${expiration.slice(0, 10)} ${symbol} Dealers Gamma Profile at Deribit`
                : `${symbol} TOTAL Dealers Gamma Profile at Deribit`,
            },
            tooltip: {
              trigger: 'axis',
            },
            xAxis: {
              type: 'category',
              data: summedData.map((item : any) => item.spot),
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: 'USD Dealers Gamma (1% move)',
              },
            },
            series: [
              {
                type: 'bar',
                data: getSeriesData(),
              },
            ],
          };
   
    
        if (chartInstance) {
          chartInstance.setOption(option);
          resizeObserver.current = new ResizeObserver(() => {
              chartInstance.resize();
          });
            resizeObserver.current.observe(chartRef.current);
          return () => {
          // Clean up the observer on component unmount
            if (chartRef.current) {
                resizeObserver.current.unobserve(chartRef.current);
              }
          };
        }
      }, [data,isDarkTheme,chartInstance]);

  return (
    <>
    <div className='flex w-full bg-white dark:bg-black px-4 py-2 my-2'>
      <div className='w-full py-4'>
          <div className='font-bold text-md md:text-lg  mb-1  text-center'><h2>AD Deriviative Gamma exposure</h2></div>
          <div ref={chartRef}  style={{ width: "100%", height: "400px" }} />
      
      </div>
    </div>
</>
  )
}

export default ADGammaExposureProfileChart