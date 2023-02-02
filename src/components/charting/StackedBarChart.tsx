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


const StackedBarChart = ( {data,  onChange} : any) => {

    const chartRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState(0);

    const volumeOption = [
        {id: 0, value: 'Notional'},
        {id: 1, value: 'Premium'}
    ]
    const byExchangeCoin = [
        {id: 0, value: 'By Exchange'},
        {id: 1, value: 'By Coin'}
    ]

    const getDataByExchange = () => {
        // group data by ts and exchangeId, and return the series data and x-axis data 
        const groupedData : any = {};
        const seriesData : any= {};
        const xData: string[] = [];
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

        Object.keys(groupedData).forEach(ts => {
            xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
            Object.keys(groupedData[ts]).forEach(exchangeId => {
                if (!seriesData[exchangeId]) {
                    seriesData[exchangeId] = [];
                }
                seriesData[exchangeId].push(groupedData[ts][exchangeId]);
            });
        });

        return [seriesData, xData]; 
    }

    const getDataByCoin = () => {
        // group data by ts and exchangeId, and return the series data and x-axis data 
        const groupedData : any = {};
        const seriesData : any= {};
        const xData: string[] = [];
        data.forEach((item: { ts: string | number; coinCurrencyID: string | number; value: string; }) => {
            if (!groupedData[item.ts]) {
                groupedData[item.ts] = {};
            }
            if (!groupedData[item.ts][item.coinCurrencyID]) {
                groupedData[item.ts][item.coinCurrencyID] = parseFloat(item.value);
            } else {
                groupedData[item.ts][item.coinCurrencyID] += parseFloat(item.value);
            }
        });

        Object.keys(groupedData).forEach(ts => {
            xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
            Object.keys(groupedData[ts]).forEach(coinCurrencyId => {
                if (!seriesData[coinCurrencyId]) {
                    seriesData[coinCurrencyId] = [];
                }
                seriesData[coinCurrencyId].push(groupedData[ts][coinCurrencyId]);
            });
        });

        return [seriesData, xData]; 
    }



    useEffect(() => {
        if (!chartRef.current) {
            return;
        }
        const chart = echarts.init(chartRef.current);
        chart.clear(); 

        // convert grouped data to data array
        let seriesData : any= {};
        let xData: string[] = [];
        const end = Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
        const start = end - 24 * 60 * 60;


        switch (filter) {
            case 0: 
            seriesData = getDataByExchange()[0];
            xData = getDataByExchange()[1];  
            break; 

            case 1: 
            seriesData = getDataByCoin()[0];
            xData = getDataByCoin()[1];  
            break; 
      
            default: 
              break; 
        }


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
                  saveAsImage: { show: true, name:"Options Volume " }
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
        });

        echartsResize(chart);
    }, [data,filter]);

    const handleFilterChange = (value: number) => {
        setFilter(value); 
    }; 

    const handleFilterVolChange = (value : number) =>{
        console.log(value)
        onChange(value)
    }

    

    
  return (
   <>
    <h2 className="ml-2 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Chart Of Options Volume</h2>
    <div style={{ textAlign: "left" }}>

        <div className='flex flex-row justify-between mb-6'>
            <div className='flex'>
                <div className='px-2 flex flex-col'>
                    <DropdownIndex 
                        title={`Exchange`}
                        options={byExchangeCoin}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className='px-2 flex flex-col'>
                    <DropdownIndex 
                        title={`Type`}
                        options={volumeOption}
                        onChange={handleFilterVolChange}
                   
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