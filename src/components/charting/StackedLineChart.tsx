import React, { useEffect,useState, useRef, useContext, useMemo } from 'react'
import * as echarts from 'echarts';
import moment from 'moment';
import { Select, Form } from "antd";  
import { echartsResize } from '../../utils/resize';
import DropdownIndex from '../misc/DropdownIndex';
import MyThemeContext from '../../store/myThemeContext';
import Loader from '../misc/Loader';
import aggregrationCalculation from '../../utils/aggregrationCalculation';
import DropdownLeft from '../misc/DropdownLeft';
import { byExchangeCoin, granularityOption } from '../../utils/selector';

const StackedLineChart = ( {data: dataSet } : any) => {
    const { isDarkTheme }= useContext(MyThemeContext); 
    const data = useMemo(() => dataSet, [dataSet]);
    const chartRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState(0); // 0 for filter by exchange, 1 for filter by currency
    const [granularity, setGranularity] = useState(0);
    let seriesData : any= {};
    let xData: string[] = [];
    let chart: any;

    const getDataByExchange = () => {
        // group data by ts and exchangeId, and return the series data and x-axis data 
        let groupedData : any = {};
        const seriesData : any= {};
        const arr = [];
        const result : any = [];
        let xData: string[] = [];
        let dataset2: { [key: string]: number[] } = {};
        let keys;

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
        const requiredKeys = ["Binance", "ByBit", "OKEX", "Deribit"];

        groupedData = Object.fromEntries(
            Object.entries(groupedData).filter(([_, value]) => {
                return requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
            })
        );
        Object.keys(groupedData).forEach(ts => {
            xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
            Object.keys(groupedData[ts]).forEach(exchangeId => {
                if (!seriesData[exchangeId]) {
                    seriesData[exchangeId] = [];
                }
                seriesData[exchangeId].push([groupedData[ts][exchangeId],moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss')]);
            });
        });

        if(granularity === 0){
            const dailyAverageAggregrationData = aggregrationCalculation(seriesData)
            arr.push(dailyAverageAggregrationData)
            const filteredDates = xData.map(dateString => dateString.slice(0, 10));
            const uniqueDates = Array.from(new Set(filteredDates)).map((obj: any)=>{return obj+" 00:00:00"});
            xData = uniqueDates;
        }
        if(granularity === 1){
            arr.push(seriesData)
        }

        if(arr.length > 0){
            for (const time of xData) {
                const obj : any= {};
                for (const exchange of Object.keys(arr[0])) {
                    for (const data of arr[0][exchange]) {
                        if (data[1] === time) {
                            obj[exchange] = data[0];
                            break;
                        } else {
                            obj[exchange] = 0;
                        }
                    }
                }
                result.push(obj);
            }
        }

        if(result.length > 0 ){
            keys = Object.keys(result[0]);
            keys.forEach(key => {
                dataset2[key] = result.map((obj: any) => obj[key]);
            });
        }      

        return [dataset2 ? dataset2 : seriesData, xData]; 
    }
    const getDataByCoin = () => {
        // group data by ts and coinCurrencyID, and return the series data and x-axis data 
        let groupedData : any = {};
        const seriesData : any= {};
        let xData: string[] = [];
        let dailyAverageAggregrationData;

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

        const requiredKeys = [ "ETH", "BTC"];
        groupedData = Object.fromEntries(
            Object.entries(groupedData).filter(([_, value]) => {
                return requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
            })
        );

        if(granularity === 0){
            Object.keys(groupedData).forEach(ts => {
                xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
                Object.keys(groupedData[ts]).forEach(coinCurrencyId => {
                    if (!seriesData[coinCurrencyId]) {
                        seriesData[coinCurrencyId] = [];
                    }
                    seriesData[coinCurrencyId].push([groupedData[ts][coinCurrencyId],moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss')]);
                });
            });
    
            dailyAverageAggregrationData = aggregrationCalculation(seriesData)
            for (const key in dailyAverageAggregrationData) {
                dailyAverageAggregrationData[key] = dailyAverageAggregrationData[key].map((entry :any) => entry[0]);
            }
            const filteredDates = xData.map(dateString => dateString.slice(0, 10));
            const uniqueDates = Array.from(new Set(filteredDates)).map((obj: any)=>{return obj+" 00:00:00"});
            xData = uniqueDates;
        }

        if(granularity === 1){
            Object.keys(groupedData).forEach(ts => {
                xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
                Object.keys(groupedData[ts]).forEach(coinCurrencyId => {
                    if (!seriesData[coinCurrencyId]) {
                        seriesData[coinCurrencyId] = [];
                    }
                    seriesData[coinCurrencyId].push(groupedData[ts][coinCurrencyId]);
                });
            });
        }
      

        return [granularity === 0 ? dailyAverageAggregrationData : seriesData, xData]; 
    }; 
    const handleFilterChange = (value: number) => {
        setFilter(value); 
    }; 

    const handleGranularityChange = (value : number ) =>{
        setGranularity(value)
    }

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }
        const end = Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
        const start = end - 24 * 60 * 60;
        chart = isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current);
        chart.clear(); // clear off any previous plotted chart 

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
                backgroundColor: 'rgba(18, 57, 60, .8)', 
                borderColor: "rgba(18, 57, 60, .8)",
                formatter: function (params : any) {
                  let str = "";
                  let strike = "";
                  let timing = "";
                  for (let i = 0; i < params.length; i++) {
                      if (params[i].seriesName !== "") {
                          let value = params[i].value
                          if (value >= 1000000) {
                            value = Number(value / 1000000).toFixed(2) + 'M';
                          } else if (value >= 100000 && value < 1000000){
                            value = Number(value / 1000).toFixed(2) + 'K';
                          }
                          timing = granularity === 0 ? params[0].name.slice(0,10) : params[0].name
                          strike = timing + "<br/>";
                          str +=  
                              params[i].marker +
                              params[i].seriesName +
                              ' : $'+
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
                  saveAsImage: { show: true, name:"Options Open Interest " }
                }
            },
            legend: {
                data: Object.keys(seriesData),
                itemWidth: 16,
                itemHeight: 9,
                x: window.innerWidth < 600 ? 'left' :'center',
                orient: "horizontal",
                textStyle: {
                    fontSize: window.innerWidth < 600 ? 8 : 12,
                }
            },
            xAxis: {
                data: xData,
                axisLabel:{
                    formatter: function (value: any) {
                        const formatDate = value.slice(0,10)
                        return formatDate;
                    }
                }
            },
            yAxis: {
                name: "Open Interest",
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
                    type: 'line',
                    stack: 'x',
                    areaStyle: {},
                    data: seriesData[exchangeId]
                };
            }),
            grid: {
                top: '18%',
                left: '4%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                    xAxisIndex: [0]
                  },
                  {
                    type: 'slider',
                    start: 0,
                    end: 100,
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
    }, [data, filter, isDarkTheme,granularity]);



  return (
   <>
    <h2 className="ml-2 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Chart Of Options Open Interest</h2>
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
                    <DropdownLeft 
                        title={`Granularity`}
                        options={granularityOption}
                        onChange={handleGranularityChange}
                    />
                </div>
            </div>
        </div>
        <div>
        </div>
        {data ? (<div ref={chartRef}  style={{ height: '400px', width:'100%'}}></div>) : (<Loader />) }
    </div>
   </>
  )
}

export default StackedLineChart