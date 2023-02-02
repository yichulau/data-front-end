import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';
import ReactEcharts from "echarts-for-react";
import DropdownCoin from '../misc/DropdownCoin';
import { echartsResize } from '../../utils/resize';
import moment from 'moment';


const LineChartOI = ({data , earliestTimestamp, latestTimeStamp} :any) => {

    const chartRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState(0);
    const [dataSet,setDataSet] = useState(data);

    let xData: string[] = [];

    const handleFilterChange = (value: number) => {
      setFilter(value); 
    }; 

    const getDataByCoin = (coin : string) =>{
      const filteredDataset = data.filter(({ coinCurrencyID } :any) => coinCurrencyID === coin);
      const xData: string[] = [];
      filteredDataset.forEach((item:any)=>{
        xData.push(moment.unix(Number(item.ts)).format('DD-MM-yy HH:mm:ss'));
      })

      return [filteredDataset, xData]
      
    } 

 

    const volumeOption = [
        {id: 0, value: 'Notional'},
        {id: 1, value: 'Premium'}
    ]
    const coinExchangeOption = [
        {id: 0, value: 'BTC'},
        {id: 1, value: 'ETH'},
        {id: 2, value: 'SOL'},
    ]






    


    useEffect(()=>{
      if (!chartRef.current) {
        return;
      }

      const end =  latestTimeStamp;
      const start = earliestTimestamp;
      const chart = echarts.init(chartRef.current);
      chart.clear(); // clear off any previous plotted chart 



      switch (filter) {
       
        case 0: 
        data = getDataByCoin('BTC')[0];
        // seriesData = getDataByExchange()[0];
        xData = getDataByCoin('BTC')[1];  
        break; 

        case 1: 
        data = getDataByCoin('ETH')[0];
        xData = getDataByCoin('ETH')[1];
        break; 

        case 2: 
        data = getDataByCoin('SOL')[0];
        xData = getDataByCoin('SOL')[1];
        break; 
      
        default: 
          break; 
      }

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          position: function (pt : any) {
            return [pt[0], '10%'];
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: 'value',
          name: 'Open Interest',
          boundaryGap: [0, '100%'],
          axisLabel:{
            formatter: function (value: any) {
                if (value >= 1000000) {
                    value = value / 1000000 + 'M';
                }
                return value;
            }
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: end -30,
            end: end,
            xAxisIndex: [0]
          },
          {
            type: 'slider',
            start: end -30,
            end: end,
            xAxisIndex: [0]
          }
        ],
        series: [
            {
              name: 'Options Open Interest',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgb(46,189,133)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(46,189,133)'
                  }
                ])
              },
              data: data
            }
          ]
      })
  
      echartsResize(chart);
    },[data,filter])

    return (
        <>
        <h2 className="ml-2 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Chart Of Open Interest By Coin</h2>
        <div style={{ textAlign: "left" }}>
    
            <div className='flex flex-row justify-between mb-6'>
                <div className='flex'>
                    <div className='px-2 flex flex-col'>
                        <DropdownCoin 
                            title={`By Coin`}
                            options={coinExchangeOption}
                            onChange={handleFilterChange}
                        />
                    </div>
                    {/* <div className='px-2 flex flex-col'>
                        <DropdownIndex 
                            title={`Type`}
                            options={volumeOption}
                            onChange={handleVolumeChange}
                       
                        />
                    </div> */}
       
                   
                </div>
            </div>
            
            <div ref={chartRef}  style={{ height: '400px', width:'100%'}}></div>
        </div>
       </>
      )
}

export default LineChartOI