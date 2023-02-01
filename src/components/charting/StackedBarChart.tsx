import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../utils/resize';
import moment from 'moment';
import { exchangeModel } from '../../models/exchangeModel';
import SelectOption from '../misc/SelectOption';
import Dropdown from '../misc/Dropdown';
import DropdownIndex from '../misc/DropdownIndex';

interface Data {
    coinCurrencyID: number;
    exchangeID: number;
    ts: number;
    value: string;
}


const StackedBarChart = ( {notionalData,  premiumData} : any) => {

    const chartRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState(notionalData)

    const handleExchangeChange = (value : any)=>{

    }

    const handleVolumeChange = (value : any )=>{
       if(value === 'Notional'){
        setData(notionalData)
       }
       if(value === 'Premium'){
        setData(premiumData)
       }
    }

    const volumeOption = [
        {id: 0, value: 'Notional'},
        {id: 1, value: 'Premium'}
    ]
    const coinExchangeOption = [
        {id: 1, value: 'By Exchange'},
        {id: 2, value: 'By Currency'},
    ]

    useEffect(() => {
        if (!chartRef.current) {
            return;
          }
        const chart = echarts.init(chartRef.current);

        // group data by ts and exchangeId
        const groupedData : any = {};
        data.forEach((item: { ts: string | number; exchangeID: string | number; value: string; }) => {
            if (!groupedData[item.ts]) {
                groupedData[item.ts] = {};
            }
            if (!groupedData[item.ts][item.exchangeID]) {
                groupedData[item.ts][item.exchangeID] = parseFloat(item.value);
            } else {
                groupedData[item.ts][item.exchangeID] += parseFloat(item.value);
            }
        });

        // convert grouped data to data array
        const seriesData : any= {};
        const xData: string[] = [];
        const end = Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
        const start = end - 24 * 60 * 60;
        Object.keys(groupedData).forEach(ts => {
            xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
            Object.keys(groupedData[ts]).forEach(exchangeId => {
                if (!seriesData[exchangeId]) {
                    seriesData[exchangeId] = [];
                }
                seriesData[exchangeId].push(groupedData[ts][exchangeId]);
            });
        });

        // set chart options
        chart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow',
                  label: {
                    show: true
                  }
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
            legend: {
                data: Object.keys(seriesData),
                orient: "horizontal",
            },
            xAxis: {
                data: xData
            },
            yAxis: {
                name: "Options Volume",
                axisLabel:{
                    formatter: function (value: any) {
                        if (value >= 1000000) {
                            value = value / 1000000 + 'M';
                        }
                        return value;
                    }
                  }
            },
            series: Object.keys(seriesData).map(exchangeId => {
                return {
                    name: exchangeId,
                    type: 'bar',
                    stack: 'total',
                    data: seriesData[exchangeId]
                };
            }),
            dataZoom: [
                {
                    type: 'slider',
                    start: start,
                    end: end,
                    xAxisIndex: [0],
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                }
            ],
        });

        echartsResize(chart);
    }, [data]);

    

    
  return (
   <>
    <h2 className="ml-2 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Chart Of Options Volume</h2>
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
        <div ref={chartRef}  style={{ height: '400px', width:'100%'}}></div>
    </div>
   </>
  )
}

export default StackedBarChart