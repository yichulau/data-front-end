import React, { useEffect,useState, useRef, useContext } from 'react'
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../utils/resize';
import moment from 'moment';
import { exchangeModel } from '../../models/exchangeModel';
import SelectOption from '../misc/SelectOption';
import Dropdown from '../misc/Dropdown';
import DropdownIndex from '../misc/DropdownIndex';
import MyThemeContext from '../../store/myThemeContext';

interface Data {
    coinCurrencyID: number;
    exchangeID: number;
    ts: number;
    value: string;
}


const StackedBarChart = ( {data,  onChange} : any) => {
    const { isDarkTheme }= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState(0);
    let seriesData : any= {};
    let xData: string[] = [];
    let chart: any;
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
    const handleFilterChange = (value: number) => {
        setFilter(value); 
    }; 
    const handleFilterVolChange = (value : number) =>{
        console.log(value)
        onChange(value)
    }
   
    useEffect(() => {
        if (!chartRef.current) {
            return;
        }
        const end = Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
        const start = end - 24 * 60 * 60;
        chart = isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current);
        chart.clear(); 

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
        const options = {
            backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            tooltip: {
                show: true,
                trigger: 'axis',
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                },
                backgroundColor: 'rgba(18, 57, 60, .8)', //设置背景颜色
                borderColor: "rgba(18, 57, 60, .8)",
                formatter: function (params : any) {
                  let str = "";
                  let strike = "";
                  for (let i = 0; i < params.length; i++) {
                      if (params[i].seriesName !== "") {
                          let value = params[i].value
                          if (value >= 1000000) {
                            value = Number(value / 1000000).toFixed(2) + 'M';
                          }
                          strike = 'Time: '+ params[0].name + "<br/>";
                          str +=  
                              params[i].marker +
                              params[i].seriesName +
                              ' : '+
                              value + ` ` +
                              "<br/>";
                      }
                  }
                  return  strike + str;
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
                itemWidth: 16,
                itemHeight: 9,
                x: window.innerWidth < 600 ? 'left' :'center',
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
            // color: [
            //     '#FF3333', '#FF7744', '#FFCC22', '#33FF33', '#33CCFF', '#7744FF', '#E93EFF'
            // ],
            series: Object.keys(seriesData).map(exchangeId => {
                return {
                    name: exchangeId,
                    type: 'bar',
                    stack: 'total',
                    data: seriesData[exchangeId],
                    // 设置柱子的宽度
                    barWidth: '50%',
                    label: {
                        show: true,
                        position: 'top',
                        color: '#333',
                        formatter: function (param : any) {
                            return '';
                        },
                    },
                }
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
                    xAxisIndex: [0],
                    bottom: '10px'
                  }
            ],
        }
        chart.setOption(options);
        echartsResize(chart);
        return () => {
            chart.dispose();
        };
    }, [data,filter, isDarkTheme]);


    

    
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