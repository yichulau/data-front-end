import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';
import ReactEcharts from "echarts-for-react";
import DropdownIndex from '../misc/DropdownIndex';


const LineChartVolume = ({data , earliestTimestamp} :any) => {

    let newEarliestTimeStamp = Number(earliestTimestamp + '000')

    const handleExchangeChange = (value : any)=>{

    }

    const handleVolumeChange = (value : any )=>{
      
    }

 

    const volumeOption = [
        {id: 0, value: 'Notional'},
        {id: 1, value: 'Premium'}
    ]
    const coinExchangeOption = [
        {id: 1, value: 'BTC'},
        {id: 2, value: 'ETH'},
        {id: 3, value: 'SOL'},
    ]

    let base = +new Date();
    console.log(base, newEarliestTimeStamp)
    let oneDay = 24 * 3600 * 1000;
    let date = [];

    for (let i = 1; i < 20000; i++) {
        var now = new Date((newEarliestTimeStamp += oneDay));
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()].join('/'));
    }
    
    const option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt : any) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: 'Large Area Chart'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: 'Open Interest Volume',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }
              ])
            },
            data: data
          }
        ]
      };
  return (
    <>
    <h2 className="ml-2 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Chart Of Options Volume By Coin</h2>
    <div style={{ textAlign: "center" }}>

        <div className='flex flex-row justify-between mb-6'>
            <div className='flex'>
                <div className='px-2 flex flex-col'>
                    <DropdownIndex 
                        title={`Exchange`}
                        options={coinExchangeOption}
                        onChange={handleExchangeChange}
                    />
                </div>
                <div className='px-2 flex flex-col'>
                    <DropdownIndex 
                        title={`Type`}
                        options={volumeOption}
                        onChange={handleVolumeChange}
                   
                    />
                </div>
   
               
            </div>
        </div>
        <ReactEcharts option={option} />
    </div>
   </>
  )
}

export default LineChartVolume